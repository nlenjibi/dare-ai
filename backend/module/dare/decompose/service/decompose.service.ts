import mongoose from "mongoose";
import { connectDB } from "@/backend/database/mongoose";
import { getAIProvider, estimateCost } from "@/backend/module/ai/provider/anthropic.provider";
import { SYSTEM_PROMPT, buildPrompt, VERSION } from "@/backend/module/ai/prompt/decompose.v1";
import { DecompositionSchema, extractAndParse } from "@/backend/module/ai/schema";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";
import { ComponentModel } from "@/backend/database/model/component.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";

export async function runDecompose(projectId: string, userId: string) {
  await connectDB();

  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const problem = await ProblemModel.findOne({ projectId });
  if (!problem) throw new Error("PROBLEM_INTAKE_REQUIRED");

  const ai = getAIProvider();
  const stagePrompt = buildPrompt({
    problem: problem.statement,
    objective: problem.objective,
    context: problem.context,
    constraints: problem.constraints,
  });

  const raw = await ai.generate({
    systemPrompt: SYSTEM_PROMPT,
    stagePrompt,
    model: process.env.AI_MODEL,
  });

  const result = extractAndParse(raw.text, DecompositionSchema);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await StageRunModel.create(
      [
        {
          projectId,
          stage: "D",
          promptVersion: VERSION,
          aiModel: raw.model,
          inputTokenCount: raw.inputTokens,
          outputTokenCount: raw.outputTokens,
          estimatedCost: estimateCost(raw.model, raw.inputTokens, raw.outputTokens),
          durationMs: raw.durationMs,
          status: "COMPLETED",
        },
      ],
      { session }
    );

    if (result.requiresUserChoice) {
      await ProblemModel.findOneAndUpdate(
        { projectId },
        { deeperObjective: result.deeperObjective },
        { session }
      );
      await ProjectModel.findByIdAndUpdate(
        projectId,
        { status: "WAITING_FOR_USER" },
        { session }
      );
      await session.commitTransaction();
      return { requiresUserChoice: true, deeperObjective: result.deeperObjective };
    }

    // Remove any prior decomposition before persisting new one
    await ComponentModel.deleteMany({ projectId }, { session });

    const docs = result.components.map((c, i) => ({
      projectId: new mongoose.Types.ObjectId(projectId),
      parentId: c.parentId ? undefined : undefined, // resolved below
      name: c.name,
      description: c.description,
      dimension: c.dimension ?? undefined,
      relationships: c.relationships,
      sortOrder: i,
    }));

    const created = await ComponentModel.insertMany(docs, { session });

    // Patch parentId references using the AI's id → our ObjectId mapping
    const idMap = new Map(result.components.map((c, i) => [c.id, created[i]._id]));
    for (let i = 0; i < result.components.length; i++) {
      const aiParentId = result.components[i].parentId;
      if (aiParentId && idMap.has(aiParentId)) {
        await ComponentModel.findByIdAndUpdate(
          created[i]._id,
          { parentId: idMap.get(aiParentId) },
          { session }
        );
      }
    }

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "COMPLETED", currentStage: "D" },
      { session }
    );

    await session.commitTransaction();
    return { requiresUserChoice: false, components: result.components };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

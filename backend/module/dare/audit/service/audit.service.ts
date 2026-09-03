import mongoose from "mongoose";
import { connectDB } from "@/backend/database/mongoose";
import { getAIProvider, estimateCost } from "@/backend/module/ai/provider/anthropic.provider";
import { SYSTEM_PROMPT, buildPrompt, VERSION } from "@/backend/module/ai/prompt/audit.v1";
import { AuditSchema, extractAndParse } from "@/backend/module/ai/schema";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";
import { ComponentModel } from "@/backend/database/model/component.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";

export async function runAudit(projectId: string, userId: string) {
  await connectDB();

  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) throw new Error("PROJECT_NOT_FOUND");
  if (project.currentStage === "D" && project.status !== "COMPLETED") {
    throw new Error("DECOMPOSE_STAGE_NOT_COMPLETED");
  }

  const problem = await ProblemModel.findOne({ projectId });
  if (!problem) throw new Error("PROBLEM_INTAKE_REQUIRED");

  const components = await ComponentModel.find({ projectId }).lean();
  if (!components.length) throw new Error("DECOMPOSE_REQUIRED_BEFORE_AUDIT");

  const ai = getAIProvider();
  // Use reasoning model for Audit — highest judgment requirement
  const model = process.env.AI_REASONING_MODEL ?? process.env.AI_MODEL;

  const stagePrompt = buildPrompt({
    problemSummary: problem.statement,
    components: components.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
    })),
  });

  const raw = await ai.generate({ systemPrompt: SYSTEM_PROMPT, stagePrompt, model });
  const result = extractAndParse(raw.text, AuditSchema);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await StageRunModel.create(
      [
        {
          projectId,
          stage: "A",
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

    // Clear prior audit before persisting new one
    await AssumptionModel.deleteMany({ projectId }, { session });

    const assumptionDocs = result.assumptions.map((a) => ({
      projectId: new mongoose.Types.ObjectId(projectId),
      componentId: a.componentId ? new mongoose.Types.ObjectId(a.componentId) : undefined,
      statement: a.statement,
      type: a.type,
      lifecycle: "UNVERIFIED",
      status: "UNVERIFIED",
      confidence: a.confidence,
      loadBearingScore: a.loadBearingScore,
      impactIfFalse: a.ifRemoved,
      inversion: a.ifInverted,
    }));

    await AssumptionModel.insertMany(assumptionDocs, { session });

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "COMPLETED", currentStage: "A" },
      { session }
    );

    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

import mongoose from "mongoose";
import { connectDB } from "@/backend/database/mongoose";
import { getAIProvider, estimateCost } from "@/backend/module/ai/provider/anthropic.provider";
import { SYSTEM_PROMPT, buildPrompt, VERSION } from "@/backend/module/ai/prompt/recombine.v1";
import { RecombineSchema, extractAndParse } from "@/backend/module/ai/schema";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";
import { ComponentModel } from "@/backend/database/model/component.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { SolutionModel } from "@/backend/database/model/solution.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";

export async function runRecombine(projectId: string, userId: string) {
  await connectDB();

  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const problem = await ProblemModel.findOne({ projectId });
  const components = await ComponentModel.find({ projectId }).lean();
  const assumptions = await AssumptionModel.find({ projectId })
    .sort({ loadBearingScore: -1 })
    .lean();

  if (!assumptions.length) throw new Error("AUDIT_REQUIRED_BEFORE_RECOMBINE");

  const supportedComponents = components; // all surviving components are building blocks
  const topAssumptions = assumptions.slice(0, 10); // top by load-bearing score
  const rejectedConventions = assumptions
    .filter((a) => a.type === "CONVENTION" && a.status === "REJECTED")
    .map((a) => a.statement);

  const ai = getAIProvider();
  const model = process.env.AI_REASONING_MODEL ?? process.env.AI_MODEL;

  const stagePrompt = buildPrompt({
    problemSummary: problem?.statement ?? "",
    verifiedBlocks: supportedComponents.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
    })),
    topAssumptions: topAssumptions.map((a) => ({
      id: a._id.toString(),
      statement: a.statement,
      type: a.type,
      loadBearingScore: a.loadBearingScore,
    })),
    rejectedConventions,
  });

  const raw = await ai.generate({ systemPrompt: SYSTEM_PROMPT, stagePrompt, model });
  const result = extractAndParse(raw.text, RecombineSchema);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await StageRunModel.create(
      [
        {
          projectId, stage: "R", promptVersion: VERSION,
          aiModel: raw.model, inputTokenCount: raw.inputTokens,
          outputTokenCount: raw.outputTokens,
          estimatedCost: estimateCost(raw.model, raw.inputTokens, raw.outputTokens),
          durationMs: raw.durationMs, status: "COMPLETED",
        },
      ],
      { session }
    );

    await SolutionModel.deleteMany({ projectId }, { session });

    const solutionDocs = result.solutions.map((s) => ({
      projectId: new mongoose.Types.ObjectId(projectId),
      name: s.name,
      description: s.description,
      structure: s.structure,
      buildingBlockIds: s.buildingBlockIds
        .map((id) => {
          try { return new mongoose.Types.ObjectId(id); } catch { return null; }
        })
        .filter(Boolean),
      rejectedConventions: s.rejectedConventions,
      newAssumptions: s.newAssumptions,
      biggestFailurePoint: s.biggestFailurePoint,
    }));

    await SolutionModel.insertMany(solutionDocs, { session });

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "COMPLETED", currentStage: "R" },
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

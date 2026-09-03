import mongoose from "mongoose";
import { connectDB } from "@/backend/database/mongoose";
import { getAIProvider, estimateCost } from "@/backend/module/ai/provider/anthropic.provider";
import { SYSTEM_PROMPT, buildPrompt, VERSION } from "@/backend/module/ai/prompt/experiment.v1";
import { ExperimentSchema, extractAndParse } from "@/backend/module/ai/schema";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";
import { SolutionModel } from "@/backend/database/model/solution.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";

export async function runExperimentDesign(
  projectId: string,
  userId: string,
  selectedSolutionIds: string[]
) {
  await connectDB();

  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const problem = await ProblemModel.findOne({ projectId });

  const solutions = await SolutionModel.find({
    _id: { $in: selectedSolutionIds },
    projectId,
  }).lean();
  if (!solutions.length) throw new Error("SOLUTIONS_REQUIRED_BEFORE_EXPERIMENT");

  const highRiskAssumptions = await AssumptionModel.find({ projectId, status: "UNVERIFIED" })
    .sort({ loadBearingScore: -1 })
    .limit(5)
    .lean();

  const ai = getAIProvider();
  const stagePrompt = buildPrompt({
    problemSummary: problem?.statement ?? "",
    selectedSolutions: solutions.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      biggestFailurePoint: s.biggestFailurePoint,
    })),
    highRiskAssumptions: highRiskAssumptions.map((a) => ({
      id: a._id.toString(),
      statement: a.statement,
      loadBearingScore: a.loadBearingScore,
    })),
    constraints: problem?.constraints,
  });

  const raw = await ai.generate({ systemPrompt: SYSTEM_PROMPT, stagePrompt });
  const result = extractAndParse(raw.text, ExperimentSchema);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await StageRunModel.create(
      [
        {
          projectId, stage: "E", promptVersion: VERSION,
          aiModel: raw.model, inputTokenCount: raw.inputTokens,
          outputTokenCount: raw.outputTokens,
          estimatedCost: estimateCost(raw.model, raw.inputTokens, raw.outputTokens),
          durationMs: raw.durationMs, status: "COMPLETED",
        },
      ],
      { session }
    );

    const experimentDocs = result.experiments.map((e) => {
      let assumptionObjId: mongoose.Types.ObjectId | undefined;
      try { assumptionObjId = new mongoose.Types.ObjectId(e.targetAssumptionId); } catch { /* skip */ }

      return {
        projectId: new mongoose.Types.ObjectId(projectId),
        assumptionId: assumptionObjId,
        hypothesis: e.hypothesis,
        procedure: e.procedure,
        metric: e.metric,
        passThreshold: e.passThreshold,
        failThreshold: e.failThreshold,
        estimatedCost: e.estimatedCost,
        estimatedDuration: e.estimatedDuration,
        risk: e.risk,
        expectedLearning: e.expectedLearning,
        status: "NOT_STARTED",
      };
    });

    await ExperimentModel.insertMany(experimentDocs, { session });

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "COMPLETED", currentStage: "E" },
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

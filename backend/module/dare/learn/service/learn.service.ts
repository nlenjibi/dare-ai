import mongoose from "mongoose";
import { connectDB } from "@/backend/database/mongoose";
import { getAIProvider, estimateCost } from "@/backend/module/ai/provider/anthropic.provider";
import { SYSTEM_PROMPT, buildPrompt, VERSION } from "@/backend/module/ai/prompt/learn.v1";
import { LearningSchema, extractAndParse } from "@/backend/module/ai/schema";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ExperimentModel } from "@/backend/database/model/experiment.model";
import { AssumptionModel } from "@/backend/database/model/assumption.model";
import { StageRunModel } from "@/backend/database/model/stage-run.model";

interface RecordResultInput {
  projectId: string;
  userId: string;
  experimentId: string;
  outcome: string;
  observations: string;
  metrics?: Record<string, unknown>;
  conclusion: string;
}

export async function recordExperimentResult(input: RecordResultInput) {
  await connectDB();

  const { projectId, userId, experimentId } = input;

  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const experiment = await ExperimentModel.findOne({ _id: experimentId, projectId });
  if (!experiment) throw new Error("EXPERIMENT_NOT_FOUND");

  let assumption = null;
  if (experiment.assumptionId) {
    assumption = await AssumptionModel.findById(experiment.assumptionId).lean();
  }

  const ai = getAIProvider();
  const stagePrompt = buildPrompt({
    experiment: {
      hypothesis: experiment.hypothesis,
      metric: experiment.metric,
      passThreshold: experiment.passThreshold,
      failThreshold: experiment.failThreshold,
      expectedLearning: experiment.expectedLearning ?? "",
    },
    result: {
      observations: input.observations,
      metrics: input.metrics,
      conclusion: input.conclusion,
    },
    assumption: assumption
      ? {
          id: assumption._id.toString(),
          statement: assumption.statement,
          loadBearingScore: assumption.loadBearingScore,
        }
      : { id: "unknown", statement: "Unknown", loadBearingScore: 0 },
  });

  const raw = await ai.generate({
    systemPrompt: SYSTEM_PROMPT,
    stagePrompt,
    model: process.env.AI_FAST_MODEL,
  });
  const result = extractAndParse(raw.text, LearningSchema);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await StageRunModel.create(
      [
        {
          projectId, stage: "L", promptVersion: VERSION,
          aiModel: raw.model, inputTokenCount: raw.inputTokens,
          outputTokenCount: raw.outputTokens,
          estimatedCost: estimateCost(raw.model, raw.inputTokens, raw.outputTokens),
          durationMs: raw.durationMs, status: "COMPLETED",
        },
      ],
      { session }
    );

    // Persist the experiment result (embedded)
    await ExperimentModel.findByIdAndUpdate(
      experimentId,
      {
        status: "COMPLETED",
        result: {
          outcome: input.outcome,
          observations: input.observations,
          metrics: input.metrics,
          conclusion: input.conclusion,
          createdAt: new Date(),
        },
      },
      { session }
    );

    // Apply assumption lifecycle updates
    for (const update of result.assumptionUpdates) {
      let assumptionObjId: mongoose.Types.ObjectId;
      try { assumptionObjId = new mongoose.Types.ObjectId(update.assumptionId); }
      catch { continue; }

      await AssumptionModel.findByIdAndUpdate(
        assumptionObjId,
        { lifecycle: update.newLifecycle },
        { session }
      );
    }

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: "COMPLETED", currentStage: "L" },
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

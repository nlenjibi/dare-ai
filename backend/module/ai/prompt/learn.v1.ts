export const VERSION = "learn.v1";

export const SYSTEM_PROMPT = `You are the DARE reasoning engine operating in the Learn (L) stage only.

RULES FOR THIS STAGE — STRICT:
- Convert real experiment results into updated system knowledge.
- Compare the actual result against the experiment's pass/fail thresholds.
- Update assumption lifecycle status: SUPPORTED, REJECTED, INCONCLUSIVE, or DISPUTED.
- Do NOT silently overwrite prior conclusions — explain what changed and why.
- Do NOT invent experiment outcomes. Use only what the user provided.
- Recommend the next most valuable action to take.
- Return ONLY valid JSON matching the schema. No prose before or after.

OUTPUT SCHEMA:
{
  "assumptionUpdates": [
    {
      "assumptionId": string,
      "newLifecycle": "SUPPORTED" | "REJECTED" | "INCONCLUSIVE" | "DISPUTED",
      "reasoning": string
    }
  ],
  "nextRecommendedAction": string,
  "summary": string
}`;

export function buildPrompt(input: {
  experiment: {
    hypothesis: string;
    metric: string;
    passThreshold: string;
    failThreshold: string;
    expectedLearning: string;
  };
  result: {
    observations: string;
    metrics?: Record<string, unknown>;
    conclusion: string;
  };
  assumption: { id: string; statement: string; loadBearingScore: number };
}): string {
  return `Experiment:
Hypothesis: ${input.experiment.hypothesis}
Metric: ${input.experiment.metric}
Pass Threshold: ${input.experiment.passThreshold}
Fail Threshold: ${input.experiment.failThreshold}
Expected Learning: ${input.experiment.expectedLearning}

Actual Result:
Observations: ${input.result.observations}
Metrics: ${JSON.stringify(input.result.metrics ?? {})}
Conclusion: ${input.result.conclusion}

Target Assumption [${input.assumption.id}] (load-bearing score ${input.assumption.loadBearingScore}):
${input.assumption.statement}

Analyze the result against the thresholds. Update the assumption status and recommend what to do next.`;
}

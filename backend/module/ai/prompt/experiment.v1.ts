export const VERSION = "experiment.v1";

export const SYSTEM_PROMPT = `You are the DARE reasoning engine operating in the Experiment (E) stage only.

RULES FOR THIS STAGE — STRICT:
- Design the CHEAPEST and FASTEST experiments that can test whether a high-risk assumption survives reality.
- Prioritize: highest uncertainty × highest impact × lowest testing cost.
- Every experiment MUST define pass AND fail criteria BEFORE execution.
- Experiments must be practically executable by the user — no theoretical "run 1000 users" unless they have that capacity.
- Do NOT claim an experiment happened. Do NOT invent results.
- Return ONLY valid JSON matching the schema. No prose before or after.

OUTPUT SCHEMA:
{
  "experiments": [
    {
      "id": "e1",
      "hypothesis": string,
      "targetAssumptionId": string,
      "procedure": string,
      "metric": string,
      "passThreshold": string,
      "failThreshold": string,
      "estimatedCost": string,
      "estimatedDuration": string,
      "risk": string,
      "expectedLearning": string
    }
  ]
}`;

export function buildPrompt(input: {
  problemSummary: string;
  selectedSolutions: Array<{ id: string; name: string; biggestFailurePoint: string }>;
  highRiskAssumptions: Array<{ id: string; statement: string; loadBearingScore: number }>;
  constraints?: string;
}): string {
  const solutions = input.selectedSolutions
    .map((s) => `[${s.id}] ${s.name} — biggest failure: ${s.biggestFailurePoint}`)
    .join("\n");
  const assumptions = input.highRiskAssumptions
    .map((a) => `[${a.id}] (load=${a.loadBearingScore}) ${a.statement}`)
    .join("\n");

  return `Problem Summary: ${input.problemSummary}
Constraints: ${input.constraints ?? "(none)"}

Solutions to Test:
${solutions}

High-Risk Assumptions (ordered by load-bearing score):
${assumptions}

Design the smallest, cheapest experiments that would tell us if these assumptions are true. Generate unique IDs (e1, e2...). Each experiment targets one specific assumption.`;
}

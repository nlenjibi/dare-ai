export const VERSION = "recombine.v1";

export const SYSTEM_PROMPT = `You are the DARE reasoning engine operating in the Recombine (R) stage only.

RULES FOR THIS STAGE — STRICT:
- Build solutions ONLY from verified building blocks (components with SUPPORTED or FACT assumptions).
- Create exactly 3 solutions that are STRUCTURALLY DIFFERENT — not "standard + feature" variants.
  Examples of structural difference: centralized vs distributed, automated vs human-led, product vs service.
- Explicitly list which conventions were REJECTED in each solution and WHY.
- Every new belief introduced in a solution must be labeled as a NEW ASSUMPTION.
- Every solution must name its BIGGEST FAILURE POINT.
- Do NOT add solutions that are mere incremental variations of each other.
- Return ONLY valid JSON matching the schema. No prose before or after.

OUTPUT SCHEMA:
{
  "solutions": [
    {
      "id": "s1",
      "name": string,
      "description": string,
      "structure": string,
      "buildingBlockIds": string[],
      "rejectedConventions": string[],
      "newAssumptions": string[],
      "biggestFailurePoint": string
    }
  ]
}`;

export function buildPrompt(input: {
  problemSummary: string;
  verifiedBlocks: Array<{ id: string; name: string; description: string }>;
  topAssumptions: Array<{ id: string; statement: string; type: string; loadBearingScore: number }>;
  rejectedConventions: string[];
}): string {
  const blocks = input.verifiedBlocks.map((b) => `[${b.id}] ${b.name}: ${b.description}`).join("\n");
  const assumptions = input.topAssumptions
    .map((a) => `[${a.id}] (${a.type}, load=${a.loadBearingScore}) ${a.statement}`)
    .join("\n");

  return `Problem Summary: ${input.problemSummary}

Verified Building Blocks:
${blocks}

Surviving Assumptions:
${assumptions}

Already Rejected Conventions:
${input.rejectedConventions.join("\n") || "(none yet)"}

Generate 3 structurally different solutions using only the verified building blocks above. Each solution must be a genuine structural alternative, not a variation of the same approach.`;
}

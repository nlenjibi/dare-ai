# DARE Platform — Implementation Guide
**Companion to:** `DARE_First_Principles_Full_PRD.md` (v1.0)
**Purpose of this document:** translate the PRD's 82 sections into an actual, sequenced build plan — what to build first, in what order, with the schema, prompts, and interfaces you need to start writing code today.
**Scope discipline:** this guide does not add scope beyond the PRD. Where a decision isn't specified in the PRD (e.g. exact library version, exact route naming), it's marked **[Guide default — not in PRD]** so you can tell the difference between requirement and implementation choice.

---

## 0. How to use this guide

The PRD's own §61 ("Recommended Development Sequence") and §80 ("Final Recommendation") are explicit: **do not build the full product at once.** The correct order is:

```
Methodology → Skill → Evaluation benchmark → Next.js foundation → Database →
AI provider adapter → D → A → R → E → L → Memory → Token optimization →
Testing → MVP
```

This guide follows that order. Each phase below maps to one or more PRD milestones (§49–58) and ends with the PRD's own exit criteria, so you always know when a phase is actually done — not just "worked on."

**Before writing any application code**, do Phase 1 (below) manually, without a repo: run the four prompts by hand (as chat turns) against 2–3 real problems. This is the PRD's own "Methodology → Skill" step, and it's the cheapest possible experiment on whether the stage prompts as written actually produce non-conventional output before you spend engineering time on them. If a prompt needs editing, edit it now, by hand, before it's embedded in code.

---

## 1. Phase 0 — Repo & Environment Setup
*(PRD §26, §49 — Milestone 1, partial)*

### 1.1 Initialize the project

```bash
npx create-next-app@latest dare --typescript --tailwind --app --src-dir=false
cd dare
npm install prisma @prisma/client zod
npm install -D @types/node
npx prisma init --datasource-provider postgresql
```

**[Guide default — not in PRD]** shadcn/ui and Lucide icons, per §26's UI stack:
```bash
npx shadcn@latest init
npm install lucide-react react-hook-form
```

### 1.2 Environment variables

Per PRD §18, the AI provider must be abstracted and the key must stay server-side:

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/dare

AI_PROVIDER=anthropic
AI_API_KEY=your_server_side_key
AI_MODEL=claude-sonnet-4-6
AI_FAST_MODEL=claude-haiku-4-5-20251001
AI_REASONING_MODEL=claude-opus-5
AI_MAX_OUTPUT_TOKENS=4096
AI_TIMEOUT_MS=30000
```

**[Guide default — not in PRD]** `AI_FAST_MODEL`/`AI_REASONING_MODEL` values are filled in as a reasonable default split (fast model for lightweight stages, reasoning model for Audit/Recombine where load-bearing judgment matters) — the PRD specifies the variable names but not which models go where; decide this based on your own cost/quality testing in Milestone 8.

### 1.3 Folder structure

Use the PRD's §27 structure exactly — it's already a sound modular-monolith layout. Scaffold the empty folders now so nothing gets bolted on ad hoc later:

```bash
mkdir -p app/{(marketing),(auth)/{login,register,forgot-password},dashboard/{projects,settings}}
mkdir -p "app/projects/[projectId]"/{problem,decompose,audit,evidence,recombine,experiments,learn,decisions,settings}
mkdir -p app/api/{ai,projects,experiments,exports}
mkdir -p components/{ui,dashboard,projects,forms}
mkdir -p components/dare
mkdir -p lib/ai/{prompts,schemas}
mkdir -p lib/dare
mkdir -p lib/{db,auth,permissions,validation,cache,utils}
mkdir -p tests/{unit,integration,e2e,fixtures}
```

**Exit criteria (Milestone 1, PRD §49):** you can register, log in, create a project, and view an empty dashboard. Wire up auth per your chosen provider **[Guide default — not in PRD specifies "mature Next.js-compatible auth solution" without naming one]** — Auth.js is the common default choice for this stack.

---

## 2. Phase 1 — Database Model
*(PRD §28, Milestone 1)*

Translate §28's entity list directly into `prisma/schema.prisma`. This is a literal implementation of the PRD's data model — no invented fields beyond what's needed for relations and enums, which the PRD describes narratively but doesn't spell out as Prisma syntax.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProjectStage {
  D
  A
  R
  E
  L
}

enum StageStatus {
  NOT_STARTED
  IN_PROGRESS
  WAITING_FOR_USER
  COMPLETED
  BLOCKED
  NEEDS_REVISION
}

enum ProjectMode {
  BUSINESS
  PRODUCT
  ENGINEERING
  RESEARCH
  STRATEGY
  CAREER
  ARCHITECTURE
  DECISION
  GENERAL
}

enum AssumptionType {
  FACT
  CONVENTION
  UNKNOWN
  ASSUMPTION
}

enum EvidenceType {
  USER_ASSERTION        // E0
  AI_INFERENCE          // E1
  DOCUMENTED_SOURCE      // E2
  EXTERNAL_EVIDENCE      // E3
  DIRECT_OBSERVATION     // E4
  EXPERIMENT_RESULT      // E5
}

enum VerificationStatus {
  UNVERIFIED
  PARTIALLY_SUPPORTED
  SUPPORTED
  DISPUTED
  REJECTED
}

enum ExperimentOutcome {
  VALIDATED
  PARTIALLY_VALIDATED
  INCONCLUSIVE
  REJECTED
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id           String       @id @default(cuid())
  user         User         @relation(fields: [userId], references: [id])
  userId       String
  name         String
  description  String?
  mode         ProjectMode  @default(GENERAL)
  currentStage ProjectStage @default(D)
  status       StageStatus  @default(NOT_STARTED)

  problem      Problem?
  components   Component[]
  assumptions  Assumption[]
  evidence     Evidence[]
  solutions    Solution[]
  experiments  Experiment[]
  decisions    Decision[]
  stageRuns    StageRun[]

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  archivedAt   DateTime?
}

model Problem {
  id                String   @id @default(cuid())
  project           Project  @relation(fields: [projectId], references: [id])
  projectId         String   @unique
  statement         String
  objective         String?
  deeperObjective   String?
  selectedObjective String?  // "ORIGINAL" | "DEEPER" — which one the user chose
  context           String?
  constraints        String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Component {
  id          String       @id @default(cuid())
  project     Project      @relation(fields: [projectId], references: [id])
  projectId   String
  parent      Component?   @relation("ComponentTree", fields: [parentId], references: [id])
  parentId    String?
  children    Component[]  @relation("ComponentTree")
  name        String
  description String
  dimension   String?
  sortOrder   Int          @default(0)
  status      StageStatus  @default(COMPLETED)

  assumptions Assumption[]
  solutionBlocks SolutionBlock[]
}

model Assumption {
  id               String         @id @default(cuid())
  project          Project        @relation(fields: [projectId], references: [id])
  projectId        String
  component        Component?     @relation(fields: [componentId], references: [id])
  componentId      String?
  statement        String
  type             AssumptionType
  status           VerificationStatus @default(UNVERIFIED)
  confidence       Float          @default(0)   // 0.0–1.0
  loadBearingScore Int            @default(0)   // 0–5 per PRD §11
  impactIfFalse    String?
  inversion        String?
  evidence         Evidence[]
  experiments      Experiment[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}

model Evidence {
  id                  String              @id @default(cuid())
  project             Project             @relation(fields: [projectId], references: [id])
  projectId           String
  assumption          Assumption?         @relation(fields: [assumptionId], references: [id])
  assumptionId        String?
  type                EvidenceType
  claim               String
  source              String?
  reference           String?
  confidence          Float               @default(0)
  verificationStatus  VerificationStatus  @default(UNVERIFIED)
  createdAt           DateTime            @default(now())
  verifiedAt          DateTime?
  verifiedBy          String?
}

model Solution {
  id                  String          @id @default(cuid())
  project             Project         @relation(fields: [projectId], references: [id])
  projectId           String
  name                String
  description         String
  structure           String
  rejectedConventions String[]
  newAssumptions      String[]
  biggestFailurePoint String
  status              StageStatus     @default(COMPLETED)
  blocks              SolutionBlock[]
  experiments         Experiment[]
  decisions           Decision[]
  createdAt           DateTime        @default(now())
}

model SolutionBlock {
  id           String    @id @default(cuid())
  solution     Solution  @relation(fields: [solutionId], references: [id])
  solutionId   String
  component    Component @relation(fields: [componentId], references: [id])
  componentId  String
  relationship String?
}

model Experiment {
  id                String             @id @default(cuid())
  project           Project            @relation(fields: [projectId], references: [id])
  projectId         String
  solution          Solution?          @relation(fields: [solutionId], references: [id])
  solutionId        String?
  assumption        Assumption?        @relation(fields: [assumptionId], references: [id])
  assumptionId      String?
  hypothesis        String
  procedure         String
  metric            String
  passThreshold     String
  failThreshold     String
  estimatedCost     String?
  estimatedDuration String?
  risk              String?
  status            StageStatus        @default(NOT_STARTED)
  result            ExperimentResult?
  createdAt         DateTime           @default(now())
}

model ExperimentResult {
  id           String            @id @default(cuid())
  experiment   Experiment        @relation(fields: [experimentId], references: [id])
  experimentId String            @unique
  outcome      ExperimentOutcome
  observations String
  metrics      Json?
  conclusion   String
  createdAt    DateTime          @default(now())
}

model Decision {
  id                 String    @id @default(cuid())
  project            Project   @relation(fields: [projectId], references: [id])
  projectId          String
  decision           String
  selectedSolution   Solution? @relation(fields: [selectedSolutionId], references: [id])
  selectedSolutionId String?
  confidence         Float?
  evidenceSummary    String?
  decisionMakerId    String
  reviewDate         DateTime?
  createdAt          DateTime  @default(now())
}

// Critical for Milestone 8 (token/cost optimization) — do not skip this table
// even in the earliest prototype, per PRD §28's own note.
model StageRun {
  id               String       @id @default(cuid())
  project          Project      @relation(fields: [projectId], references: [id])
  projectId        String
  stage            ProjectStage
  promptVersion    String
  model            String
  inputTokenCount  Int
  outputTokenCount Int
  estimatedCost    Float
  status           String
  error            String?
  createdAt        DateTime     @default(now())
}
```

```bash
npx prisma migrate dev --name init
```

**Exit criteria:** schema migrates cleanly; you can create a `User` → `Project` → `Problem` chain in a Prisma Studio session by hand.

---

## 3. Phase 2 — AI Provider Adapter & DARE Core Engine
*(PRD §18, §30, §31, Milestone 2)*

This is the phase the PRD is most emphatic about getting right before UI work starts (§80: "build the reasoning system first, constrain the AI by stage"). Do not skip to UI before this phase's exit criteria is met.

### 3.1 Provider interface

Per §18 — one interface, swappable providers, key stays server-side:

```ts
// lib/ai/provider.ts
export interface AIRequest {
  systemPrompt: string;
  stagePrompt: string;
  context: string;
  model?: string;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export interface AIProvider {
  generate(input: AIRequest): Promise<AIResponse>;
  generateStructured<T>(input: AIRequest, schema: unknown): Promise<T>;
}
```

```ts
// lib/ai/providers/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, AIRequest, AIResponse } from "../provider";

const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

export class AnthropicProvider implements AIProvider {
  async generate(input: AIRequest): Promise<AIResponse> {
    const response = await client.messages.create({
      model: input.model ?? process.env.AI_MODEL!,
      max_tokens: input.maxTokens ?? Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 4096),
      system: input.systemPrompt,
      messages: [{ role: "user", content: `${input.stagePrompt}\n\n${input.context}` }],
    });
    const text = response.content
      .filter((b): b is { type: "text"; text: string } => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return {
      text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
    };
  }

  async generateStructured<T>(input: AIRequest, schema: unknown): Promise<T> {
    // See §3.3 below — validate-and-retry wrapper
    const raw = await this.generate(input);
    return parseAndValidate<T>(raw.text, schema);
  }
}
```

**[Guide default — not in PRD]** the exact retry/validation helper (`parseAndValidate`) isn't specified in the PRD beyond "AI response validates against schema" (§76.3). A minimal version:

```ts
// lib/ai/validate.ts
import { ZodSchema } from "zod";

export function parseAndValidate<T>(raw: string, schema: ZodSchema<T>): T {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI_SCHEMA_VALIDATION_FAILED: no JSON object found");
  const parsed = JSON.parse(jsonMatch[0]);
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI_SCHEMA_VALIDATION_FAILED: ${result.error.message}`);
  }
  return result.data;
}
```

On a validation failure, per §77 Risk 2 mitigation ("no automatic promotion to fact"), the stage should return to `NEEDS_REVISION` state rather than silently accepting malformed output — never fall back to unstructured text as if it were the structured result.

### 3.2 Prompt architecture — one file per stage, versioned

Per §30: never one giant prompt. Per §57/§77 Risk 6 (prompt drift): prompts must be versioned. Structure:

```
lib/ai/prompts/
├── decompose.v1.ts
├── audit.v1.ts
├── recombine.v1.ts
├── experiment.v1.ts
└── learn.v1.ts
```

Each file exports a system prompt (fixed identity) and a stage-prompt builder (per-project variables). Example — the file that matters most, since it's the one the PRD is strictest about (§10, §6.2):

```ts
// lib/ai/prompts/decompose.v1.ts
export const DECOMPOSE_SYSTEM_PROMPT = `You are the DARE reasoning engine, operating in the Decompose stage only.

Rules for this stage:
- Do not solve the problem.
- Do not recommend anything.
- Do not classify anything as fact, assumption, or convention — that is a later stage.
- Do not introduce standard playbooks or industry-conventional structures.
- If the stated problem appears to contain a hidden or deeper objective, state it in one sentence and explicitly ask the user which problem to decompose. Do not proceed with decomposition until told which one.
- Return ONLY the JSON object described in the schema. No prose before or after it.`;

export function buildDecomposeStagePrompt(input: {
  problem: string;
  objective?: string;
  context?: string;
  constraints?: string;
}) {
  return `Problem: ${input.problem}
Objective: ${input.objective ?? "(not specified)"}
Context: ${input.context ?? "(none provided)"}
Constraints: ${input.constraints ?? "(none provided)"}

Break this problem into its smallest useful constituent parts. Build a hierarchy: the overall problem, its major components, and elements inside each component. Use only relevant dimensions (people, process, time, resources, cost, etc.). For each component, explain what it contains and how it connects to the larger problem. Stop decomposing when going further would not improve understanding.

Return your answer as JSON matching this shape:
{
  "deeperObjective": string | null,
  "requiresUserChoice": boolean,
  "components": [
    { "id": string, "parentId": string | null, "name": string, "description": string, "dimension": string | null, "relationships": string[] }
  ]
}`;
}
```

The Audit, Recombine, and Experiment prompts follow the same pattern using the exact rule sets from PRD §11, §13, §14 — each stage's system prompt should restate that stage's specific "MUST NOT" list, because per §6.2/§77 Risk 1 ("AI gives conventional answers"), the PRD's own mitigation is *strict stage prompts*, not a single shared prompt with a stage variable swapped in.

### 3.3 Zod schemas — one-to-one with §31

```ts
// lib/ai/schemas/decompose.ts
import { z } from "zod";

export const DecompositionSchema = z.object({
  deeperObjective: z.string().nullable(),
  requiresUserChoice: z.boolean(),
  components: z.array(z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    name: z.string(),
    description: z.string(),
    dimension: z.string().nullable(),
    relationships: z.array(z.string()),
  })),
});
export type DecompositionResult = z.infer<typeof DecompositionSchema>;
```

Repeat for `AuditSchema`, `RecombineSchema`, `ExperimentSchema` directly from the TypeScript types already given in PRD §31 — those types are Zod-ready as written; don't reinterpret their field names.

### 3.4 State machine

Per §41 (FR-004) and the stage lifecycle in §76:

```ts
// lib/dare/state-machine.ts
import { StageStatus, ProjectStage } from "@prisma/client";

const VALID_TRANSITIONS: Record<StageStatus, StageStatus[]> = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_USER", "COMPLETED", "BLOCKED", "NEEDS_REVISION"],
  WAITING_FOR_USER: ["IN_PROGRESS", "COMPLETED"],
  NEEDS_REVISION: ["IN_PROGRESS"],
  BLOCKED: ["IN_PROGRESS"],
  COMPLETED: ["IN_PROGRESS"], // re-opening a stage is allowed (PRD FR-003: "MAY allow users to revisit")
};

export function canTransition(from: StageStatus, to: StageStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const STAGE_ORDER: ProjectStage[] = ["D", "A", "R", "E", "L"];

export function nextStage(current: ProjectStage): ProjectStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}
```

Per §76.9 ("failure does not corrupt previous state"): every stage transition and AI call should happen inside a single Prisma transaction — write the `StageRun` record and the stage's actual output (Components / Assumptions / Solutions / Experiments) together, or not at all.

### 3.5 Orchestrator — the piece that ties it together

```ts
// lib/dare/orchestrator.ts
import { prisma } from "../db/prisma";
import { AnthropicProvider } from "../ai/providers/anthropic";
import { DECOMPOSE_SYSTEM_PROMPT, buildDecomposeStagePrompt } from "../ai/prompts/decompose.v1";
import { DecompositionSchema } from "../ai/schemas/decompose";

const provider = new AnthropicProvider();

export async function runDecompose(projectId: string) {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: { problem: true },
  });
  if (!project.problem) throw new Error("PROBLEM_INTAKE_REQUIRED");

  const stagePrompt = buildDecomposeStagePrompt({
    problem: project.problem.statement,
    objective: project.problem.objective ?? undefined,
    context: project.problem.context ?? undefined,
    constraints: project.problem.constraints ?? undefined,
  });

  const start = Date.now();
  const raw = await provider.generate({
    systemPrompt: DECOMPOSE_SYSTEM_PROMPT,
    stagePrompt,
    context: "",
  });
  const result = DecompositionSchema.parse(extractJson(raw.text));

  await prisma.$transaction(async (tx) => {
    await tx.stageRun.create({
      data: {
        projectId, stage: "D", promptVersion: "decompose.v1",
        model: raw.model, inputTokenCount: raw.inputTokens,
        outputTokenCount: raw.outputTokens,
        estimatedCost: estimateCost(raw.model, raw.inputTokens, raw.outputTokens),
        status: "COMPLETED",
      },
    });
    if (result.requiresUserChoice) {
      await tx.problem.update({
        where: { projectId },
        data: { deeperObjective: result.deeperObjective },
      });
      await tx.project.update({ where: { id: projectId }, data: { status: "WAITING_FOR_USER" } });
      return; // do not persist components until the user chooses — PRD §6.2
    }
    for (const c of result.components) {
      await tx.component.create({ data: { projectId, ...c } });
    }
    await tx.project.update({ where: { id: projectId }, data: { status: "COMPLETED" } });
  });

  return result;
}
```

`runAudit`, `runRecombine`, `runExperiment`, `runLearn` follow the identical shape: load required inputs (§10–§15's "Inputs" lists tell you exactly what each stage needs — Audit needs D's output, Recombine needs Audit's surviving blocks, etc.), build the stage prompt, call the provider, validate, persist inside a transaction, update `currentStage`.

**Exit criteria (Milestone 2, PRD §50):** a complete D→A→R→E→L cycle can execute end-to-end against a seeded test project via a script or test suite — before any UI exists.

---

## 4. Phase 3 — Stage-by-Stage UX
*(Milestones 3–7, PRD §51–55)*

Build the UI only after Phase 2's exit criteria passes. Each stage gets its own route under `app/projects/[projectId]/` and its own API route, per §29:

| Route | API | Reads | Writes |
|---|---|---|---|
| `/problem` | — | — | `Problem` |
| `/decompose` | `POST /dare/decompose` | `Problem` | `Component[]` |
| `/audit` | `POST /dare/audit` | `Component[]` | `Assumption[]`, `Evidence[]` |
| `/evidence` | `POST/PATCH/DELETE /evidence` | `Assumption` | `Evidence` |
| `/recombine` | `POST /dare/recombine` | `Assumption[]` (status ≠ REJECTED) | `Solution[]`, `SolutionBlock[]` |
| `/experiments` | `POST /dare/experiment`, `POST /experiments/:id/result` | `Solution[]` | `Experiment[]`, `ExperimentResult` |
| `/learn` | `POST /dare/learn` | `ExperimentResult` | updates `Assumption.status`, `Evidence`, `Solution.status` |
| `/decisions` | `POST/GET /decisions` | `Solution`, evidence summary | `Decision` |

**Non-negotiable UI requirement across every stage (§32, §73):** every AI-generated field must be editable, and the interface must never present output as "the answer" — always as evidence + assumptions + alternatives + next test (§73's exact framing). Build the stage components (`assumption-table.tsx`, `solution-card.tsx`, `experiment-card.tsx`, per §27) with this framing baked into their copy, not added as an afterthought banner.

**Stage controls (§32):** every stage view needs Back / Save / Regenerate / Edit / Approve / Continue. "Regenerate" re-runs the same stage prompt (new `StageRun`, incrementing `promptVersion` usage count) without discarding the prior run — keep both for auditability (§76.9).

**Exit criteria per milestone:**
- Milestone 3: user can create and approve a decomposition, including the hidden-objective branch.
- Milestone 4: user can inspect/edit assumptions and evidence, see load-bearing scores.
- Milestone 5: user receives 3 structurally different solutions (not "standard + feature" variants — §13's explicit anti-pattern).
- Milestone 6: user can create, run, and record an experiment with pass/fail thresholds set *before* the result is recorded.
- Milestone 7: recording an experiment result actually changes assumption status and is visible in the project timeline.

---

## 5. Phase 4 — Token & Cost Optimization
*(PRD §19, §38–39, Milestone 8)*

Do this only after a full cycle works — optimizing token usage before the flow is correct is wasted effort. Per §19/§77 Risk 3, the concrete levers, in the order the PRD implies:

1. **Context minimization:** each stage prompt should receive only what §10–§15 list as that stage's actual inputs — Audit gets D's component tree, not the full problem-intake form plus every prior stage run. This is why `runDecompose`/`runAudit`/etc. above each build their own narrow context rather than passing the whole project object.
2. **Summaries:** for Recombine/Experiment, if the Audit output is large, summarize surviving (non-rejected) assumptions into a compact block list rather than passing every field of every `Assumption` row.
3. **Model routing:** use `AI_FAST_MODEL` for cheap, low-judgment operations (e.g., regenerating a single component's description) and `AI_REASONING_MODEL` for Audit/Recombine, where load-bearing judgment matters most.
4. **Prompt versioning + caching:** the `promptVersion` field on `StageRun` already supports this — never overwrite a prompt file in place once it's been used in production; bump the version suffix (`decompose.v2.ts`) and keep the old one importable for regression comparison (§57, §77 Risk 6).
5. **Token tracking dashboard:** `StageRun` already captures everything needed (§28's own note: "critical for monitoring"); Milestone 8's UI work is mostly a read query and chart over that table, not new instrumentation.

**Exit criteria:** no stage sends unnecessary project history, and token usage per project is queryable and visible in the dashboard.

---

## 6. Phase 5 — Quality, Security, Guardrails
*(PRD §41–47, §57, Milestone 9)*

Build in this order, since each depends on the last:

1. **Unit tests** for the Zod schemas and state machine transitions (pure functions, no DB/AI needed).
2. **AI evaluation benchmark** (§46): a fixed set of 5–10 sample problems with known-good expected properties (e.g., "Decompose output must not contain the word 'solution'"; "Audit output must classify at least one item as CONVENTION, not just FACT") run against every prompt version before it ships — this is the direct implementation of §77 Risk 1's mitigation and Risk 6's regression evaluation.
3. **Integration tests** for each API route (auth required, correct stage-input validation, correct transaction behavior on failure).
4. **Authorization audit** (§42): every route must check `project.userId === session.user.id` — do this as shared middleware, not per-route, so it can't be forgotten on a new route.
5. **Rate limiting** (§39, §77 Risk 3): per-user request caps on `/dare/*` routes specifically, since those are the token-cost-bearing routes — not a blanket app-wide limiter.
6. **Error handling** (§43) and **observability** (§44): structured error responses distinguishing `AI_SCHEMA_VALIDATION_FAILED`, `AI_PROVIDER_TIMEOUT`, `AI_PROVIDER_ERROR` from ordinary validation errors, since §77 Risk 2's mitigation depends on the system knowing *why* a stage failed, not just that it failed.
7. **E2E test:** one full D→A→R→E→L cycle through the actual UI, not just the API.

**Exit criteria:** critical flows pass, and a security review confirms no cross-user data access is possible.

---

## 7. Phase 6 — MVP Release
*(PRD §58, §81)*

Use the PRD's own checklist (§81) as your literal release gate — do not add features from §59/§60 (Growth/Platform milestones: team workspaces, document upload, web research, integrations, billing) until every item in §81 is checked. The PRD is explicit that MVP should *exclude* these (§58's "MVP Should Exclude" list) — resist scope creep here specifically, since first-principles/decision tools are exactly the kind of product that invites "just one more integration" pressure.

---

## 8. What to build first, concretely, this week

If you're starting from zero and want the smallest possible slice that proves the core loop works before committing to the full stack:

1. Do the manual prompt-testing step from §0 above — no code yet.
2. Stand up Phase 0 + Phase 1 (repo, schema, migration) — half a day.
3. Build **only** the Decompose stage end-to-end: provider adapter, one prompt file, one Zod schema, one orchestrator function, called from a single test script (no UI). This proves the hardest part of §80's stack (server-side AI call → schema validation → transactional persistence) works before you build four more stages on top of an unproven pattern.
4. Only after step 3 passes, copy the exact same pattern for Audit, Recombine, Experiment, Learn — they are structurally identical, differing only in prompt content and schema shape.
5. Then, and only then, start Phase 3 (UI).

This sequencing is the direct, literal reading of the PRD's own §61 and §80 — the PRD's biggest risk section (§77 Risk 5, "Overengineering") exists specifically to warn against building the Next.js scaffold, auth, and UI before the reasoning core is proven to work.

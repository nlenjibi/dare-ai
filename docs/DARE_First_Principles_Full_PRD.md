# DARE — First-Principles Reasoning Platform
## Full Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Product Blueprint / MVP-to-Production  
**Frontend/Backend:** Next.js full-stack  
**AI:** Configurable AI provider through server-side API key  
**Primary Architecture:** Next.js App Router + TypeScript + PostgreSQL + Prisma  
**Document Type:** Master PRD with section-level PRDs, user stories, milestones, architecture, data model, API contracts, security, token optimization, testing, and roadmap

---

# 1. Executive Summary

DARE is an AI-powered first-principles reasoning and decision platform.

It converts a user's problem into a controlled reasoning workflow:

1. **D — Decompose:** break the problem into useful constituent parts.
2. **A — Audit:** identify facts, assumptions, conventions, unknowns, and load-bearing assumptions.
3. **R — Recombine:** construct alternative solutions from verified building blocks.
4. **E — Experiment:** design the cheapest and fastest real-world tests.
5. **L — Learn:** capture experiment results and update assumptions for the next iteration.

The source framework emphasizes that AI should perform analytical work while the human remains the decision maker. DARE therefore must not behave as an unrestricted chatbot. It should operate as a structured reasoning system with explicit stages, evidence states, user approvals, persistent project memory, and experiment history.

The product should use an existing AI provider through an API key rather than training or hosting a model. The AI provider must be abstracted behind a server-side provider interface so the application can switch models/providers without changing the product architecture.

The first version should be built as a **Next.js full-stack application**, keeping frontend, server actions/API routes, authentication, database access, AI orchestration, and business logic in one repository.

---

# 2. Product Vision

## Vision

Build a personal and organizational **reasoning workspace** where people can turn ambiguous problems into:

- clearly defined problem structures;
- explicit assumptions;
- verified evidence;
- alternative solution configurations;
- cheap experiments;
- learning records;
- auditable decisions.

## Product Positioning

DARE is not primarily:

- a chatbot;
- a generic AI assistant;
- a prompt library;
- an autonomous decision maker;
- a model-training company.

DARE is a **reasoning operating system** built on top of existing AI models.

## Core Product Equation

```text
Existing AI Model
+
DARE Reasoning Skill
+
Structured State
+
Project Memory
+
Evidence
+
Experimentation
+
Human Judgment
=
DARE Platform
```

---

# 3. Problem Statement

People frequently solve problems using inherited assumptions and standard playbooks.

Typical behavior:

```text
Problem
→ Familiar solution
→ Implementation
→ Failure
```

DARE changes the sequence:

```text
Problem
→ Decompose
→ Audit assumptions
→ Verify building blocks
→ Recombine
→ Experiment
→ Learn
→ Decide
```

AI creates an additional problem: a general-purpose model can produce a plausible conventional answer before the user has properly examined the problem.

DARE therefore constrains the model by stage.

The D stage must not solve the problem.  
The A stage must challenge assumptions.  
The R stage must build from verified blocks.  
The E stage must test ideas against reality.

---

# 4. Product Goals

## Primary Goals

1. Provide a repeatable first-principles reasoning workflow.
2. Prevent premature solution generation.
3. Separate facts, assumptions, conventions, and unknowns.
4. Maintain persistent reasoning state.
5. Make assumptions and evidence auditable.
6. Generate structurally different solution configurations.
7. Turn uncertainty into inexpensive experiments.
8. Learn from experiment results.
9. Keep humans as final decision makers.
10. Minimize AI token usage and API cost.
11. Allow different AI providers/models through configuration.
12. Provide an excellent Next.js web experience.

## Secondary Goals

- Support business, product, engineering, research, strategy, and personal-decision use cases.
- Provide reusable templates.
- Support project history and versioning.
- Enable export to Markdown/PDF in later versions.
- Provide team collaboration in a later phase.

---

# 5. Non-Goals

The initial product will NOT:

- train a foundation model;
- claim that AI reasoning is always correct;
- automatically make high-impact decisions for users;
- execute financial, legal, medical, or other consequential actions without appropriate human review;
- run unrestricted autonomous agents;
- keep entire conversations in every AI request;
- treat AI-generated claims as verified facts;
- automatically browse the internet for every stage;
- build a custom LLM infrastructure.

---

# 6. Product Principles

## 6.1 Decompose Before Solving

Do not generate solutions while the problem is still poorly understood.

## 6.2 Never Silently Reframe

If a deeper objective is detected, show it and ask the user which problem should be analyzed.

## 6.3 Facts Are Not Assumptions

Every important claim should have a status.

## 6.4 Challenge Conventions

A common practice is not automatically a necessity.

## 6.5 Eliminate Before Adding

Ask whether a component can be removed before proposing another component.

## 6.6 Recombine Verified Building Blocks

Solutions should primarily be constructed from surviving components.

## 6.7 Experiment Before Commitment

Test high-risk assumptions before investing heavily.

## 6.8 Reality Is the Final Judge

AI analysis is not validation.

## 6.9 Human Judgment Remains Central

The application may analyze, compare, and recommend. The user owns the final decision.

## 6.10 Show Evidence, Not Hidden Reasoning

DARE should expose structured evidence, assumptions, calculations, decisions, and summaries rather than private chain-of-thought.

---

# 7. Target Users

## 7.1 Founder / Entrepreneur

Needs to evaluate:

- business ideas;
- markets;
- business models;
- customer assumptions;
- pricing;
- distribution.

## 7.2 Product Manager

Needs to evaluate:

- product problems;
- features;
- user needs;
- MVP scope;
- product assumptions.

## 7.3 Software Engineer / Architect

Needs to evaluate:

- architecture;
- technology choices;
- scalability;
- performance assumptions;
- infrastructure decisions.

## 7.4 Researcher / Student

Needs to evaluate:

- research questions;
- hypotheses;
- methodology;
- assumptions;
- experiments;
- evidence.

## 7.5 Strategist / Consultant

Needs to evaluate:

- organizational problems;
- operational systems;
- strategic alternatives;
- risks.

---

# 8. Core User Journey

```text
Create Account
    ↓
Create Project
    ↓
Describe Problem
    ↓
DARE Intake
    ↓
D — Decompose
    ↓
User Review / Approval
    ↓
A — Audit
    ↓
Evidence Verification
    ↓
User Review / Approval
    ↓
R — Recombine
    ↓
Compare Solutions
    ↓
User Selects Solutions to Test
    ↓
E — Experiment
    ↓
Run Experiment
    ↓
Record Result
    ↓
L — Learn
    ↓
Update Assumptions
    ↓
New Decision / New DARE Cycle
```

---

# 9. Master Functional Requirements

## FR-001 Project Management

The system SHALL allow users to:

- create projects;
- rename projects;
- archive projects;
- delete projects;
- duplicate projects;
- view project history;
- configure project type;
- configure project constraints.

## FR-002 Problem Intake

The system SHALL capture:

- problem statement;
- objective;
- context;
- constraints;
- desired outcome;
- known evidence;
- optional deadline;
- optional budget;
- optional risk tolerance.

## FR-003 DARE Workflow

The system SHALL enforce the sequence:

```text
D → A → R → E → L
```

The system MAY allow users to revisit previous stages.

## FR-004 Stage State

Each project SHALL maintain:

```text
NOT_STARTED
IN_PROGRESS
WAITING_FOR_USER
COMPLETED
BLOCKED
NEEDS_REVISION
```

## FR-005 Evidence

The system SHALL distinguish:

```text
USER_ASSERTION
AI_INFERENCE
DOCUMENTED_SOURCE
EXTERNAL_EVIDENCE
DIRECT_OBSERVATION
EXPERIMENT_RESULT
```

## FR-006 Assumptions

Each assumption SHALL have:

- unique ID;
- statement;
- category;
- evidence;
- confidence;
- load-bearing score;
- status;
- impact if false;
- inversion;
- related components;
- related experiments.

## FR-007 Solutions

Each solution SHALL contain:

- name;
- description;
- verified blocks;
- rejected conventions;
- new assumptions;
- structure;
- benefits;
- constraints;
- biggest failure point.

## FR-008 Experiments

Each experiment SHALL contain:

- hypothesis;
- target assumption;
- procedure;
- resources;
- time;
- estimated cost;
- risk;
- metric;
- pass threshold;
- fail threshold;
- expected learning;
- actual result;
- conclusion.

## FR-009 Learning

The system SHALL update:

- assumption status;
- evidence;
- experiment results;
- solution viability;
- decisions;
- next recommended experiment.

## FR-010 Decision Log

Users SHALL be able to record:

- decision;
- date;
- evidence;
- selected solution;
- rejected alternatives;
- reasoning summary;
- responsible user;
- confidence;
- review date.

---

# 10. Section PRD — D: Decompose

## Purpose

Understand what the problem is made of without prematurely solving it.

## Inputs

```text
Problem
Context
Constraints
Objective
```

## AI Mission

The AI must:

1. detect a possible hidden objective;
2. present the hidden objective in one sentence;
3. ask whether to analyze the original or deeper problem;
4. wait for user selection;
5. build a hierarchy;
6. identify relevant dimensions;
7. stop when further decomposition no longer improves understanding.

## D Output

```text
Problem
├── Component
│   ├── Element
│   └── Element
├── Component
│   ├── Element
│   └── Element
└── Component
```

Each component includes:

- ID;
- name;
- description;
- parent;
- relationship;
- relevant dimension.

## D Constraints

The AI MUST NOT:

- recommend solutions;
- evaluate components;
- classify assumptions;
- introduce standard playbooks;
- silently reframe the problem.

## D Acceptance Criteria

- User can understand the hierarchy.
- No solution appears in decomposition.
- Deeper objective requires user confirmation.
- Components have stable IDs.
- Output is persisted.

---

# 11. Section PRD — A: Audit

## Purpose

Expose inherited assumptions and determine which building blocks are supported.

## Inputs

- D output;
- available evidence;
- user context.

## AI Mission

For each important claim:

1. identify assumption;
2. classify it;
3. inspect evidence;
4. determine load-bearing importance;
5. explain what happens if removed;
6. explain what happens if inverted.

## Classification

```text
FACT
CONVENTION
UNKNOWN
ASSUMPTION
```

## Evidence Status

```text
UNVERIFIED
PARTIALLY_SUPPORTED
SUPPORTED
DISPUTED
REJECTED
```

## Load-Bearing Score

```text
0 — Irrelevant
1 — Low
2 — Moderate
3 — Significant
4 — Major
5 — Foundational
```

## Audit Output

| ID | Assumption | Type | Evidence | Confidence | Load-Bearing | If Removed | If Inverted |
|---|---|---|---|---|---|---|---|

## Acceptance Criteria

- Every major component can be audited.
- Evidence is visible.
- Unsupported claims remain uncertain.
- Highest-risk assumptions are identifiable.
- AI does not invent verification.

---

# 12. Section PRD — Evidence & Verification

## Purpose

Prevent the system from confusing generated content with reality.

## Evidence Hierarchy

```text
E0 — User assertion
E1 — AI inference
E2 — Documented source
E3 — Reliable external evidence
E4 — Direct observation
E5 — Experiment result
```

## Rules

1. AI-generated claims cannot automatically become facts.
2. Evidence must retain its source.
3. Conflicting evidence must remain visible.
4. Users can manually verify or reject evidence.
5. Experiment results have higher priority for tested hypotheses.
6. The system must record when evidence was added.

## Evidence Object

```text
Evidence
├── id
├── type
├── claim
├── source
├── sourceReference
├── confidence
├── createdAt
├── verifiedAt
└── verifiedBy
```

---

# 13. Section PRD — R: Recombine

## Purpose

Create alternative solutions from verified building blocks.

## Inputs

- surviving components;
- verified facts;
- supported assumptions;
- rejected conventions.

## Rules

The system SHALL:

- use verified building blocks;
- create structurally different configurations;
- explicitly identify rejected conventions;
- identify new assumptions;
- identify the largest failure point.

## Solution Diversity

The three default solutions should differ structurally.

Examples:

```text
Solution A — Centralized
Solution B — Distributed
Solution C — Automated
```

The system must avoid:

```text
Solution A — Standard
Solution B — Standard + feature
Solution C — Standard + another feature
```

## R Output

```text
Solution
├── Structure
├── Building Blocks
├── Rejected Conventions
├── New Assumptions
├── Expected Advantage
└── Biggest Failure Point
```

## Acceptance Criteria

- At least 3 solutions by default.
- Solutions are materially different.
- New assumptions are labeled.
- Discarded conventions are explicit.
- Each solution has a failure point.

---

# 14. Section PRD — E: Experiment

## Purpose

Find the cheapest, fastest way to determine whether a solution or assumption survives reality.

## Experiment Selection Rule

Prioritize:

```text
Highest uncertainty
×
Highest impact
×
Lowest testing cost
```

## Experiment Inputs

- solution;
- assumption;
- available resources;
- risk tolerance.

## Experiment Output

```text
Hypothesis
Target Assumption
Test
Cost
Time
Risk
Metric
Pass Threshold
Fail Threshold
Expected Learning
```

## Pass / Fail

Every experiment MUST define pass/fail criteria before execution.

## Acceptance Criteria

- Experiment can actually be run.
- Cost and time are estimated.
- Pass/fail thresholds exist.
- The experiment targets a meaningful uncertainty.
- The system identifies what is learned either way.

---

# 15. Section PRD — L: Learn

## Purpose

Convert real-world results into updated system knowledge.

## Inputs

- experiment result;
- observations;
- metrics;
- user interpretation.

## Learning Process

```text
Result
↓
Compare against threshold
↓
Update hypothesis
↓
Update assumption
↓
Update evidence
↓
Update solution viability
↓
Recommend next stage
```

## Possible Outcomes

```text
VALIDATED
PARTIALLY_VALIDATED
INCONCLUSIVE
REJECTED
```

## Acceptance Criteria

- Experiment result is persisted.
- Assumption status is updated.
- Evidence history is preserved.
- Next action is identified.
- Previous conclusions are not silently overwritten.

---

# 16. Section PRD — Project Workspace

## Purpose

Provide a persistent visual workspace for a DARE project.

## Main Areas

```text
Project
├── Overview
├── Problem
├── D — Decompose
├── A — Audit
├── Evidence
├── R — Recombine
├── E — Experiments
├── L — Learn
├── Decisions
├── Timeline
└── Settings
```

## Dashboard

Show:

- current stage;
- completion;
- highest-risk assumptions;
- open experiments;
- recent evidence;
- latest decisions;
- next recommended action.

---

# 17. Section PRD — Templates / Modes

DARE should support templates without changing its core reasoning engine.

## Modes

```text
Business
Product
Engineering
Research
Strategy
Career
Decision
Architecture
General
```

A mode changes:

- suggested dimensions;
- vocabulary;
- example questions;
- default experiment types.

It MUST NOT bypass the core DARE rules.

---

# 18. Section PRD — AI Provider

## Goal

Use a configured external AI API without coupling DARE to one vendor.

## Architecture

```text
DARE Agent
   ↓
AI Service
   ↓
Provider Interface
   ├── Provider A
   ├── Provider B
   └── Provider C
```

The API key MUST remain server-side.

## Environment Variables

```env
AI_PROVIDER=provider_name
AI_API_KEY=server_secret
AI_MODEL=default_model
AI_FAST_MODEL=fast_model
AI_REASONING_MODEL=reasoning_model
AI_MAX_OUTPUT_TOKENS=...
AI_TIMEOUT_MS=...
```

Actual provider-specific variables should be stored in the deployment secret manager.

## Provider Interface

```ts
interface AIProvider {
  generate(input: AIRequest): Promise<AIResponse>;
  generateStructured<T>(
    input: AIRequest,
    schema: unknown
  ): Promise<T>;
}
```

The rest of the application must never directly call a provider SDK.

---

# 19. Token and Cost Optimization PRD

## Objective

Make DARE useful without repeatedly sending massive prompts and entire project histories.

The goal is not literally zero tokens. Any AI request consumes input/output tokens. The product should minimize unnecessary tokens and API calls.

## Principle

```text
Never send what the model does not need.
```

## 19.1 Stage-Specific Context

D receives:

```text
Problem
Context
Constraints
```

A receives:

```text
Problem Summary
Decomposition
Relevant Evidence
```

R receives:

```text
Verified Blocks
Rejected Conventions
Top Assumptions
```

E receives:

```text
Selected Solutions
Highest-Risk Assumptions
Constraints
```

L receives:

```text
Experiment
Result
Relevant Assumption
```

Do not send the entire project to every stage.

## 19.2 Persistent Structured State

Store outputs as structured JSON/database records.

Do not use the previous AI response as the only source of truth.

## 19.3 Rolling Summaries

Maintain:

```text
project_summary
stage_summary
decision_summary
evidence_summary
```

Update summaries after meaningful changes.

## 19.4 No Full Chat Replay

Do not resend:

```text
100-message conversation
```

when the model only needs:

```text
current problem
current state
relevant blocks
```

## 19.5 Prompt Versioning

Store prompts as versioned templates.

```text
DARE_D_V1
DARE_A_V1
DARE_R_V1
DARE_E_V1
DARE_L_V1
```

## 19.6 Structured Output

Use JSON schema / structured output where supported.

This reduces parsing instructions and improves deterministic persistence.

## 19.7 Model Routing

Use:

```text
Fast/cheap model:
- classification
- summarization
- metadata
- simple extraction

Stronger model:
- assumption audit
- recombination
- difficult experiment design
```

## 19.8 Caching

Cache deterministic or repeated operations using:

```text
hash(input + promptVersion + model)
```

Never cache private responses across users.

## 19.9 Retry Policy

Retry only transient failures.

Do not blindly regenerate a failed AI answer multiple times.

## 19.10 User-Controlled Depth

Offer:

```text
Quick
Balanced
Deep
```

Quick mode minimizes calls and output size.

Deep mode performs more analysis.

---

# 20. Agent PRD

## Purpose

The agent orchestrates DARE without becoming an uncontrolled autonomous system.

## Agent Responsibilities

The agent can:

- determine current stage;
- validate required inputs;
- call the correct skill;
- request missing information;
- persist outputs;
- call approved tools;
- recommend next action.

## Agent Cannot

- silently change the problem;
- skip user approval when required;
- fabricate evidence;
- declare real-world validation without evidence;
- make consequential decisions for the user.

## Agent State

```text
currentStage
requiredInputs
completedStages
pendingQuestions
assumptions
evidence
solutions
experiments
decisions
```

---

# 21. Memory PRD

## Memory Types

### Project Memory

Persistent project facts.

### Reasoning Memory

DARE outputs and state.

### Evidence Memory

Claims and sources.

### Assumption Memory

Assumption lifecycle.

### Experiment Memory

Tests and results.

### Decision Memory

Historical decisions.

### User Preferences

Non-sensitive preferences such as preferred analysis depth.

## Memory Rule

Memory is retrieved by relevance, not dumped wholesale into the prompt.

---

# 22. Assumption Lifecycle

```text
DISCOVERED
    ↓
UNVERIFIED
    ↓
TESTING
    ↓
SUPPORTED ───────┐
    ↓            │
REJECTED         │
    ↑            │
    └────────────┘
```

Additional status:

```text
DISPUTED
INCONCLUSIVE
SUPERSEDED
```

Never delete historical assumptions merely because they became false.

---

# 23. Decision Log PRD

Every significant decision should have:

```text
Decision ID
Project
Decision
Date
Evidence
Assumptions
Alternatives
Selected Solution
Confidence
Decision Maker
Review Date
Outcome
```

This creates organizational learning.

---

# 24. User Stories

## Epic 1 — Account

### US-001
As a user, I want to create an account so that my DARE projects persist.

### US-002
As a user, I want to sign in securely so that only I can access my projects.

### US-003
As a user, I want to sign out so that my account remains protected.

---

## Epic 2 — Projects

### US-004
As a user, I want to create a project so that I can analyze a problem.

### US-005
As a user, I want to name my project so that I can find it later.

### US-006
As a user, I want to archive a project so that inactive work does not clutter my workspace.

### US-007
As a user, I want to reopen an archived project so that historical reasoning remains accessible.

---

## Epic 3 — Intake

### US-008
As a user, I want to describe my problem in natural language.

### US-009
As a user, I want to specify constraints.

### US-010
As a user, I want to define the desired outcome.

### US-011
As a user, I want DARE to identify a possible deeper objective without silently changing my problem.

---

## Epic 4 — Decompose

### US-012
As a user, I want DARE to break my problem into useful components.

### US-013
As a user, I want to see the component hierarchy.

### US-014
As a user, I want to approve the problem being analyzed before continuing.

### US-015
As a user, I want to revise decomposition when it is inaccurate.

---

## Epic 5 — Audit

### US-016
As a user, I want DARE to identify assumptions.

### US-017
As a user, I want to know whether a claim is fact, convention, or unknown.

### US-018
As a user, I want to see evidence supporting an assumption.

### US-019
As a user, I want to know which assumptions are load-bearing.

### US-020
As a user, I want to see what changes if an assumption is inverted.

---

## Epic 6 — Evidence

### US-021
As a user, I want to attach evidence to claims.

### US-022
As a user, I want to mark evidence as verified.

### US-023
As a user, I want conflicting evidence to remain visible.

### US-024
As a user, I want to know whether a conclusion came from an experiment or an inference.

---

## Epic 7 — Recombine

### US-025
As a user, I want DARE to generate three structurally different solutions.

### US-026
As a user, I want each solution to show its building blocks.

### US-027
As a user, I want each solution to show rejected conventions.

### US-028
As a user, I want to see the biggest failure point of each solution.

---

## Epic 8 — Experiment

### US-029
As a user, I want DARE to identify the riskiest assumption.

### US-030
As a user, I want DARE to design the cheapest useful experiment.

### US-031
As a user, I want explicit pass/fail criteria.

### US-032
As a user, I want to record experiment results.

---

## Epic 9 — Learn

### US-033
As a user, I want experiment results to update assumptions.

### US-034
As a user, I want to see what was learned.

### US-035
As a user, I want DARE to suggest what should be tested next.

---

## Epic 10 — Decisions

### US-036
As a user, I want to record decisions.

### US-037
As a user, I want to understand why a previous decision was made.

### US-038
As a user, I want to revisit decisions after new evidence appears.

---

# 25. Non-Functional Requirements

## Performance

- Initial dashboard should target fast perceived rendering.
- AI requests must show progress states.
- Database queries should be indexed.
- Large project pages should use pagination/lazy loading where appropriate.

## Reliability

- AI failure must not corrupt project state.
- Stage outputs should be persisted transactionally.
- AI jobs should be retryable.
- Failed generation should not overwrite the last successful state.

## Security

- API keys only on server.
- Authentication required for private projects.
- Authorization checked on every project operation.
- Users must never access another user's project by ID manipulation.
- Rate limiting required on AI endpoints.
- Sensitive logs must exclude API keys and private prompts where possible.

## Privacy

- User projects are private by default.
- AI provider usage must follow the provider's applicable data policies.
- Provide project deletion.
- Do not expose private project content in public search.

## Accessibility

- Keyboard navigation.
- Accessible form controls.
- Screen-reader labels.
- Adequate contrast.
- Focus states.

---

# 26. Recommended Technology Stack

## Application

```text
Next.js
TypeScript
React
App Router
Server Components
Server Actions / Route Handlers
```

## UI

```text
Tailwind CSS
shadcn/ui
Lucide icons
React Hook Form
Zod
```

## Database

```text
PostgreSQL
Prisma ORM
```

## Authentication

Use a mature Next.js-compatible authentication solution.

Recommended architecture:

```text
Auth
↓
Session
↓
User
↓
Project ownership
```

## AI

```text
Provider SDK
↓
AI Provider Adapter
↓
DARE AI Service
```

## Validation

```text
Zod
```

## Background Processing

MVP:

```text
Next.js server-side execution
```

Production when required:

```text
Job queue
Redis-compatible store
Worker
```

Do not introduce a queue before workload requires it.

---

# 27. Next.js Full-Stack Architecture

```text
app/
├── (marketing)/
│   ├── page.tsx
│   ├── about/
│   ├── pricing/
│   └── blog/
│
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── dashboard/
│   ├── page.tsx
│   ├── projects/
│   └── settings/
│
├── projects/
│   └── [projectId]/
│       ├── page.tsx
│       ├── problem/
│       ├── decompose/
│       ├── audit/
│       ├── evidence/
│       ├── recombine/
│       ├── experiments/
│       ├── learn/
│       ├── decisions/
│       └── settings/
│
├── api/
│   ├── ai/
│   ├── projects/
│   ├── experiments/
│   └── exports/
│
└── layout.tsx

components/
├── ui/
├── dashboard/
├── projects/
├── dare/
│   ├── stage-header.tsx
│   ├── stage-progress.tsx
│   ├── problem-tree.tsx
│   ├── assumption-table.tsx
│   ├── evidence-panel.tsx
│   ├── solution-card.tsx
│   ├── experiment-card.tsx
│   └── decision-log.tsx
└── forms/

lib/
├── ai/
│   ├── provider.ts
│   ├── service.ts
│   ├── prompts/
│   ├── schemas/
│   └── token-budget.ts
├── dare/
│   ├── orchestrator.ts
│   ├── state-machine.ts
│   ├── decomposition.ts
│   ├── audit.ts
│   ├── recombination.ts
│   ├── experiment.ts
│   └── learning.ts
├── db/
│   └── prisma.ts
├── auth/
├── permissions/
├── validation/
├── cache/
└── utils/

prisma/
└── schema.prisma

tests/
├── unit/
├── integration/
├── e2e/
└── fixtures/
```

---

# 28. Database Model

## User

```text
User
- id
- email
- name
- createdAt
- updatedAt
```

## Project

```text
Project
- id
- userId
- name
- description
- mode
- currentStage
- status
- createdAt
- updatedAt
- archivedAt
```

## Problem

```text
Problem
- id
- projectId
- statement
- objective
- deeperObjective
- selectedObjective
- context
- constraints
- createdAt
- updatedAt
```

## Component

```text
Component
- id
- projectId
- parentId
- name
- description
- dimension
- sortOrder
- status
```

## Assumption

```text
Assumption
- id
- projectId
- componentId
- statement
- type
- status
- confidence
- loadBearingScore
- impactIfFalse
- inversion
- createdAt
- updatedAt
```

## Evidence

```text
Evidence
- id
- projectId
- assumptionId
- type
- claim
- source
- reference
- confidence
- verificationStatus
- createdAt
```

## Solution

```text
Solution
- id
- projectId
- name
- description
- structure
- biggestFailurePoint
- status
- createdAt
```

## SolutionBlock

```text
SolutionBlock
- id
- solutionId
- componentId
- relationship
```

## Experiment

```text
Experiment
- id
- projectId
- solutionId
- assumptionId
- hypothesis
- procedure
- metric
- passThreshold
- failThreshold
- estimatedCost
- estimatedDuration
- risk
- status
- createdAt
```

## ExperimentResult

```text
ExperimentResult
- id
- experimentId
- outcome
- observations
- metrics
- conclusion
- createdAt
```

## Decision

```text
Decision
- id
- projectId
- decision
- selectedSolutionId
- confidence
- evidenceSummary
- decisionMakerId
- reviewDate
- createdAt
```

## StageRun

```text
StageRun
- id
- projectId
- stage
- promptVersion
- model
- inputTokenCount
- outputTokenCount
- estimatedCost
- status
- error
- createdAt
```

This is critical for monitoring token consumption and AI cost.

---

# 29. API / Server Actions

## Projects

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

## DARE

```text
POST /api/projects/:id/dare/decompose
POST /api/projects/:id/dare/audit
POST /api/projects/:id/dare/recombine
POST /api/projects/:id/dare/experiment
POST /api/projects/:id/dare/learn
```

## Evidence

```text
POST   /api/projects/:id/evidence
PATCH  /api/evidence/:id
DELETE /api/evidence/:id
```

## Experiments

```text
POST   /api/projects/:id/experiments
GET    /api/projects/:id/experiments
PATCH  /api/experiments/:id
POST   /api/experiments/:id/result
```

## Decisions

```text
POST /api/projects/:id/decisions
GET  /api/projects/:id/decisions
```

---

# 30. AI Prompt Architecture

Never place the entire DARE system into one giant prompt.

Use:

```text
SYSTEM PROMPT
+
STAGE PROMPT
+
TASK CONTEXT
+
STRUCTURED STATE
```

Example:

```text
System:
You are the DARE reasoning engine.

Stage:
D — Decompose.

Rules:
Do not solve.
Do not recommend.
Do not audit.

Context:
{problem}

Constraints:
{constraints}

Output:
JSON schema.
```

This is cheaper, more controllable, and easier to evaluate.

---

# 31. Structured AI Schemas

## Decomposition

```ts
type DecompositionResult = {
  deeperObjective?: string;
  requiresUserChoice: boolean;
  components: Array<{
    id: string;
    parentId?: string;
    name: string;
    description: string;
    dimension?: string;
    relationships: string[];
  }>;
};
```

## Audit

```ts
type AuditResult = {
  assumptions: Array<{
    id: string;
    statement: string;
    type: "FACT" | "CONVENTION" | "UNKNOWN" | "ASSUMPTION";
    evidenceIds: string[];
    confidence: number;
    loadBearingScore: number;
    ifRemoved: string;
    ifInverted: string;
  }>;
};
```

## Recombine

```ts
type RecombineResult = {
  solutions: Array<{
    id: string;
    name: string;
    description: string;
    buildingBlockIds: string[];
    rejectedConventions: string[];
    newAssumptions: string[];
    biggestFailurePoint: string;
  }>;
};
```

## Experiment

```ts
type ExperimentResult = {
  experiments: Array<{
    id: string;
    hypothesis: string;
    targetAssumptionId: string;
    procedure: string[];
    metric: string;
    passThreshold: string;
    failThreshold: string;
    estimatedCost: string;
    estimatedDuration: string;
    risk: string;
    expectedLearning: string;
  }>;
};
```

---

# 32. UI / UX Requirements

## Global Layout

```text
Sidebar
    Projects
    Templates
    Evidence
    Experiments
    Decisions
    Settings

Main Content
    Project Header
    DARE Progress
    Current Stage
```

## DARE Progress

```text
[D] → [A] → [R] → [E] → [L]
 ✓       ✓      ●      ○      ○
```

## Stage Controls

Each stage should have:

```text
Back
Save
Regenerate
Edit
Approve
Continue
```

AI-generated content should be editable.

---

# 33. Landing Page

Sections:

1. Hero
2. Problem
3. How DARE works
4. D/A/R/E/L explanation
5. Example project
6. Benefits
7. Use cases
8. Pricing
9. FAQ
10. CTA
11. Footer

Main CTA:

```text
Start Thinking From First Principles
```

---

# 34. Dashboard

Dashboard widgets:

```text
Active Projects
Open Assumptions
Experiments
Decisions
Current DARE Cycles
```

Project card:

```text
Project Name
Mode
Current Stage
Progress
Top Risk
Next Action
Updated
```

---

# 35. Project Overview

Show:

```text
Problem
Objective
Current Stage
Top 5 Assumptions
Open Experiments
Latest Decision
Evidence Count
```

---

# 36. Assumption Interface

Use a table:

```text
Assumption
Type
Confidence
Load-Bearing
Evidence
Status
Experiment
```

Filters:

```text
All
Unverified
High Risk
Supported
Rejected
Unknown
```

---

# 37. Experiment Interface

Each experiment:

```text
Hypothesis
Why it matters
Target assumption
Procedure
Metric
Pass
Fail
Cost
Time
Risk
Result
Learning
```

---

# 38. Token Budgeting System

Every AI run should have a budget.

Example configuration:

```ts
type TokenBudget = {
  maxInputTokens: number;
  maxOutputTokens: number;
  maxRetries: number;
};
```

Budgets should be stage-specific.

Example:

```text
D → medium
A → high
R → high
E → medium
L → low
```

The actual limits should be configurable by model/provider.

## Token Monitoring

Track:

```text
input tokens
output tokens
total tokens
model
stage
estimated cost
cache hit
duration
```

Display aggregated usage to administrators.

---

# 39. Cost Controls

Implement:

- per-user daily AI limits;
- per-project limits;
- plan-based limits;
- maximum output length;
- maximum regeneration attempts;
- rate limiting;
- caching;
- model routing;
- request cancellation;
- duplicate request prevention.

---

# 40. Subscription Architecture

Future plans:

```text
Free
Pro
Premium
Team
```

Do not hard-code plan limits into DARE logic.

Use a feature entitlement layer:

```ts
canUseFeature(user, "DARE_DEEP_ANALYSIS")
canUseFeature(user, "EXPORT")
canUseFeature(user, "TEAM_COLLABORATION")
```

Payment provider should be abstracted similarly to AI providers.

---

# 41. Security Architecture

```text
Browser
  ↓ HTTPS
Next.js
  ↓ Authentication
Authorization
  ↓
Server Action / API
  ↓
Validation
  ↓
Business Logic
  ↓
Prisma
  ↓
PostgreSQL
```

AI:

```text
Browser
  ↓
Next.js server
  ↓
AI Service
  ↓
Provider
```

The browser must never receive:

```text
AI_API_KEY
DATABASE_URL
provider secret
```

---

# 42. Authorization Rules

Every project query must scope by authenticated user:

```text
WHERE project.id = projectId
AND project.userId = currentUser.id
```

Never rely on frontend route protection alone.

---

# 43. Error Handling

## User Errors

Examples:

- empty problem;
- invalid stage transition;
- missing required input.

## AI Errors

Examples:

- timeout;
- provider unavailable;
- invalid structured response;
- quota exceeded.

## Database Errors

Examples:

- transaction failure;
- connection failure.

All errors should map to user-safe messages.

Never expose:

- API keys;
- stack traces;
- internal prompts;
- provider secrets.

---

# 44. Observability

Track:

```text
Request ID
User ID
Project ID
Stage
Model
Prompt Version
Input Tokens
Output Tokens
Latency
Status
Error Category
Cache Hit
```

Avoid storing sensitive raw prompt content unless explicitly required.

---

# 45. Testing Strategy

## Unit Tests

Test:

- stage transitions;
- assumption scoring;
- evidence status;
- token budgeting;
- permission functions;
- validation schemas.

## Integration Tests

Test:

- database;
- AI provider adapter;
- project creation;
- DARE stage persistence;
- experiment updates.

## E2E Tests

Critical flow:

```text
Register
→ Create Project
→ Enter Problem
→ Decompose
→ Approve
→ Audit
→ Recombine
→ Create Experiment
→ Record Result
→ Learn
→ Decision
```

## AI Evaluation Tests

Create a fixed benchmark set.

For each problem evaluate:

- premature solution rate;
- assumption detection;
- evidence discipline;
- solution diversity;
- experiment quality;
- schema validity;
- token usage.

---

# 46. AI Quality Evaluation

DARE should have a benchmark dataset.

Example categories:

```text
10 Business
10 Product
10 Engineering
10 Research
10 Strategy
10 General Decisions
```

Score each response:

```text
0–5 Decomposition quality
0–5 Assumption quality
0–5 Evidence discipline
0–5 Solution diversity
0–5 Experiment quality
0–5 Instruction adherence
```

Track regression between prompt versions.

---

# 47. Guardrails

## Guardrail 1

Do not silently change the user's objective.

## Guardrail 2

Do not call an assumption a fact without evidence.

## Guardrail 3

Do not claim an experiment occurred unless the user records it or an integrated tool confirms it.

## Guardrail 4

Do not manufacture citations.

## Guardrail 5

Do not expose private chain-of-thought.

## Guardrail 6

Do not allow one stage to perform another stage's job.

## Guardrail 7

Do not make irreversible consequential decisions automatically.

---

# 48. Milestone Roadmap

## Milestone 0 — Product Foundation

### Deliverables

- finalized DARE methodology;
- product principles;
- user personas;
- requirements;
- database design;
- architecture;
- AI provider abstraction.

### Exit Criteria

PRD approved and technical design ready.

---

# 49. Milestone 1 — Project Foundation

### Tasks

- initialize Next.js;
- configure TypeScript;
- configure Tailwind;
- configure UI system;
- configure Prisma;
- configure PostgreSQL;
- authentication;
- environment configuration;
- project structure;
- CI.

### Exit Criteria

User can register, log in, create a project, and view the dashboard.

---

# 50. Milestone 2 — DARE Core Engine

### Tasks

- state machine;
- D prompt;
- A prompt;
- R prompt;
- E prompt;
- L prompt;
- Zod schemas;
- AI provider adapter;
- structured output handling.

### Exit Criteria

A complete DARE cycle can execute against a test project.

---

# 51. Milestone 3 — Decompose UX

### Tasks

- problem intake;
- deeper-objective detection;
- approval UI;
- problem tree;
- component editing;
- persistence.

### Exit Criteria

User can create and approve a decomposition.

---

# 52. Milestone 4 — Audit & Evidence

### Tasks

- assumption table;
- evidence records;
- confidence;
- load-bearing scoring;
- verification status;
- evidence UI;
- audit generation.

### Exit Criteria

User can inspect and edit assumptions and evidence.

---

# 53. Milestone 5 — Recombine

### Tasks

- verified-block selection;
- three solution generation;
- solution cards;
- structural diversity evaluation;
- rejected conventions;
- new assumptions.

### Exit Criteria

User receives three meaningfully different solutions.

---

# 54. Milestone 6 — Experiment

### Tasks

- experiment designer;
- experiment CRUD;
- pass/fail criteria;
- experiment execution tracking;
- results.

### Exit Criteria

User can create, run, and record an experiment.

---

# 55. Milestone 7 — Learn & Decisions

### Tasks

- learning engine;
- assumption updates;
- evidence updates;
- decision log;
- project timeline;
- next action.

### Exit Criteria

A completed experiment changes the project's reasoning state.

---

# 56. Milestone 8 — Token Optimization

### Tasks

- stage-specific context;
- summaries;
- prompt versioning;
- model routing;
- token tracking;
- caching;
- regeneration limits.

### Exit Criteria

No stage sends unnecessary project history and token usage is measurable.

---

# 57. Milestone 9 — Quality & Security

### Tasks

- unit tests;
- integration tests;
- E2E tests;
- AI benchmark;
- authorization audit;
- rate limiting;
- error handling;
- observability.

### Exit Criteria

Critical flows pass and security review is complete.

---

# 58. Milestone 10 — MVP Release

### MVP Must Include

- authentication;
- projects;
- problem intake;
- D;
- A;
- R;
- E;
- L;
- evidence;
- assumptions;
- experiments;
- decisions;
- token-aware AI architecture;
- responsive UI;
- basic usage limits.

### MVP Should Exclude

- team collaboration;
- complex integrations;
- mobile app;
- custom model;
- autonomous web research;
- complex billing;
- advanced analytics.

---

# 59. Milestone 11 — Growth

Potential features:

- team workspaces;
- collaboration;
- comments;
- project sharing;
- document upload;
- web research;
- citation management;
- integrations;
- advanced analytics;
- exports;
- templates marketplace.

---

# 60. Milestone 12 — Platform

Long-term:

```text
DARE Platform
├── Personal reasoning
├── Team reasoning
├── Research
├── Product strategy
├── Engineering architecture
├── Business strategy
├── Experiment management
├── Evidence management
└── Decision intelligence
```

---

# 61. Recommended Development Sequence

Do NOT build everything simultaneously.

Build:

```text
1. Methodology
2. Skill
3. Evaluation benchmark
4. Next.js foundation
5. Database
6. AI provider adapter
7. D
8. A
9. R
10. E
11. L
12. Memory
13. Token optimization
14. Testing
15. MVP
```

---

# 62. MVP Success Metrics

## Product Metrics

- projects created;
- DARE cycles started;
- DARE cycles completed;
- experiments created;
- experiments completed;
- decisions recorded;
- returning users.

## Quality Metrics

- decomposition adherence;
- assumption detection;
- evidence accuracy;
- solution diversity;
- experiment usefulness;
- user correction rate.

## AI Efficiency Metrics

```text
Average tokens/project
Average tokens/stage
Average AI cost/project
Cache hit rate
Average regeneration count
```

## Key Metric

A strong north-star metric could be:

> **Validated Decisions per Active Project**

This rewards learning and useful outcomes rather than raw AI usage.

---

# 63. Product Analytics Events

```text
user_registered
project_created
problem_submitted
decomposition_generated
decomposition_approved
audit_generated
assumption_verified
assumption_rejected
solution_generated
solution_selected
experiment_created
experiment_completed
learning_recorded
decision_created
dare_cycle_completed
ai_generation_failed
ai_generation_retried
```

---

# 64. Recommended MVP Navigation

```text
Dashboard
Projects
Templates
Evidence
Experiments
Decisions
Settings
```

Inside project:

```text
Overview
Problem
D — Decompose
A — Audit
Evidence
R — Recombine
E — Experiment
L — Learn
Decisions
Timeline
Settings
```

---

# 65. Settings

## Account

- profile;
- email;
- password/authentication;
- delete account.

## AI

If allowed by the product:

- model preference;
- analysis depth;
- usage statistics.

API keys should normally remain deployment/admin secrets rather than being exposed in the client.

## Project Defaults

- default mode;
- default depth;
- experiment preferences.

## Privacy

- data retention;
- delete projects;
- export data.

---

# 66. Future Tool Layer

DARE can later integrate tools.

```text
Tools
├── Web Search
├── Browser
├── File Search
├── Calculator
├── Spreadsheet
├── Database
├── Analytics
└── External APIs
```

Tool use must be stage-aware.

Example:

```text
D:
Usually no external tools required.

A:
Evidence search may be useful.

R:
Mostly reasoning.

E:
External tools may help design or measure tests.

L:
Experiment data is primary.
```

---

# 67. Document / File Intelligence

Future feature:

```text
Upload Document
↓
Extract text
↓
Chunk
↓
Index
↓
Retrieve relevant sections
↓
Attach evidence
↓
Audit assumptions
```

Do not send entire documents to every AI request.

Retrieve only relevant sections.

---

# 68. Web Research

Future research flow:

```text
Claim
↓
Search
↓
Sources
↓
Evidence extraction
↓
User/source verification
↓
Evidence store
↓
Audit
```

The system should distinguish:

```text
AI-generated claim
vs
externally sourced evidence
```

---

# 69. Collaboration

Future team roles:

```text
Owner
Editor
Reviewer
Viewer
```

Review workflow:

```text
Analyst
↓
DARE output
↓
Reviewer
↓
Evidence verification
↓
Decision maker
```

---

# 70. Versioning

Every major DARE stage should be versionable.

```text
Decomposition v1
Decomposition v2

Audit v1
Audit v2

Solution v1
Solution v2
```

Users should be able to compare versions.

Never destroy historical reasoning.

---

# 71. Export

Future exports:

```text
Markdown
PDF
JSON
CSV
```

A project export should include:

```text
Problem
Decomposition
Assumptions
Evidence
Solutions
Experiments
Results
Learning
Decisions
Timeline
```

---

# 72. Example End-to-End Scenario

## User Problem

> I want to build a financial management app for small businesses.

### D

The system identifies:

```text
Users
Financial information
Transactions
Budgeting
Reporting
Goals
Data collection
Trust
Payments
Costs
```

It does not immediately recommend features.

### A

It identifies assumptions such as:

```text
Users want a mobile-first application.
Users will enter transactions.
Users will connect financial accounts.
Users will pay for automation.
```

Each receives evidence status and load-bearing score.

### R

Possible structures:

```text
Solution A
Manual-first financial workspace

Solution B
Automated transaction-first system

Solution C
Advisor/decision-first system
```

### E

Instead of building the entire application:

```text
Experiment 1:
Interview 15 target businesses.

Experiment 2:
Prototype one transaction workflow.

Experiment 3:
Test willingness to pay.
```

### L

Results update the assumptions.

The user then decides what to build.

---

# 73. Important Design Decision

The product should not present AI output as:

> "This is the answer."

Prefer:

> "Here is the current evidence, these are the assumptions, these are the alternatives, and this is the cheapest next test."

This is central to the product's identity.

---

# 74. Recommended Internal Modules

```text
DARE Core
├── Intake
├── Decompose
├── Audit
├── Evidence
├── Recombine
├── Experiment
├── Learn
├── Decision
└── State

AI
├── Provider
├── Prompt Manager
├── Schema Validator
├── Context Builder
├── Token Budget
├── Cache
└── Evaluation

Data
├── Prisma
├── Repositories
├── Transactions
└── Migrations

Security
├── Auth
├── Authorization
├── Rate Limits
└── Secrets

Product
├── Projects
├── Templates
├── Billing
├── Analytics
└── Notifications
```

---

# 75. Definition of Done — Feature

A feature is complete only when:

- requirements implemented;
- validation implemented;
- authorization implemented;
- loading state implemented;
- error state implemented;
- database persistence implemented;
- tests implemented;
- AI calls are server-side;
- token usage is measured where AI is involved;
- accessible UI exists;
- mobile/responsive behavior works;
- documentation updated.

---

# 76. Definition of Done — DARE Stage

A stage is complete only when:

1. Required inputs exist.
2. Correct prompt/version is selected.
3. AI response validates against schema.
4. Output is persisted.
5. Token usage is recorded.
6. User can review output.
7. User can edit output where appropriate.
8. State transition is valid.
9. Failure does not corrupt previous state.

---

# 77. Risks

## Risk 1 — AI Gives Conventional Answers

Mitigation:

- strict stage prompts;
- structured schemas;
- stage-specific context;
- evaluation benchmarks.

## Risk 2 — Hallucinated Evidence

Mitigation:

- evidence types;
- source references;
- verification state;
- no automatic promotion to fact.

## Risk 3 — Excessive API Cost

Mitigation:

- context minimization;
- summaries;
- caching;
- model routing;
- budgets;
- rate limits.

## Risk 4 — Users Skip Reasoning

Mitigation:

- explicit stage UI;
- approvals;
- stage explanations;
- decision checkpoints.

## Risk 5 — Overengineering

Mitigation:

- Next.js full-stack;
- PostgreSQL;
- Prisma;
- one repository;
- no microservices initially;
- no custom model.

## Risk 6 — Prompt Drift

Mitigation:

- versioned prompts;
- benchmark tests;
- stage regression evaluation.

---

# 78. Architecture Recommendation

For the first production version, use:

```text
Next.js Full Stack
+
PostgreSQL
+
Prisma
+
Authentication
+
Zod
+
AI Provider Adapter
+
Server-side AI calls
```

Avoid:

```text
Microservices
Kubernetes
Custom LLM
Vector database
Event bus
Complex agent framework
```

unless actual requirements justify them.

A modular monolith is the recommended starting architecture.

---

# 79. Final Product Architecture

```text
                         DARE APP
                            │
                    ┌───────┴───────┐
                    │    Next.js    │
                    │ Full Stack    │
                    └───────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
       UI Layer         Application        Server Layer
          │              Services              │
          │                 │                  │
          │         ┌───────┴────────┐         │
          │         │ DARE Agent     │         │
          │         └───────┬────────┘         │
          │                 │                  │
          │         ┌───────┴────────┐         │
          │         │ DARE Core      │         │
          │         │ D A R E L      │         │
          │         └───────┬────────┘         │
          │                 │                  │
          │         ┌───────┴────────┐         │
          │         │ Context Engine │         │
          │         └───────┬────────┘         │
          │                 │                  │
          │         ┌───────┴────────┐         │
          │         │ AI Provider    │         │
          │         │ Adapter        │         │
          │         └───────┬────────┘         │
          │                 │                  │
          │              AI API                │
          │                                    │
          └────────────────┬───────────────────┘
                           │
                    ┌──────┴──────┐
                    │   Prisma    │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ PostgreSQL  │
                    └─────────────┘
```

---

# 80. Final Recommendation

Build DARE as a **modular monolith first**.

The correct progression is:

```text
DARE Methodology
        ↓
DARE Skill
        ↓
DARE Evaluation Benchmark
        ↓
DARE AI Service
        ↓
DARE Memory / State
        ↓
DARE Agent
        ↓
Next.js Full-Stack App
        ↓
MVP
        ↓
Usage + Evaluation Data
        ↓
Optimization
        ↓
Platform
```

Do not start by training a model.

Do not start with microservices.

Do not build an autonomous agent that controls everything.

Do not send the entire conversation/project to the AI on every request.

Build the reasoning system first, constrain the AI by stage, persist structured state, retrieve only relevant context, measure token usage, and keep the user as the decision maker.

---

# 81. MVP Release Checklist

```text
[ ] Next.js application
[ ] Authentication
[ ] PostgreSQL
[ ] Prisma
[ ] Project CRUD
[ ] Problem intake
[ ] D decomposition
[ ] User approval
[ ] A audit
[ ] Evidence
[ ] R recombination
[ ] Three solution structures
[ ] E experiment design
[ ] Experiment results
[ ] L learning
[ ] Decision log
[ ] DARE state machine
[ ] AI provider abstraction
[ ] Server-side API key
[ ] Structured AI output
[ ] Prompt versioning
[ ] Token tracking
[ ] Context minimization
[ ] Rate limiting
[ ] AI error handling
[ ] Unit tests
[ ] Integration tests
[ ] E2E tests
[ ] AI benchmark
[ ] Responsive UI
[ ] Security review
[ ] Production deployment
```

---

# 82. Product North Star

The product should ultimately help a user move from:

> **"I think this is the answer."**

to:

> **"I understand the problem, I know which assumptions I'm making, I know what evidence supports them, I have alternatives, I know what to test, and I know what I learned."**

That is the core value of DARE.

export const DARE_STAGES = [
  { key: "D", label: "Decompose", description: "Break the problem into first-principle components" },
  { key: "A", label: "Audit",     description: "Surface and classify hidden assumptions" },
  { key: "R", label: "Recombine", description: "Generate solutions from challenged assumptions" },
  { key: "E", label: "Experiment",description: "Design cheap tests to validate key assumptions" },
  { key: "L", label: "Learn",     description: "Synthesize results and update the assumption map" },
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_COMPONENTS_DISPLAY = 6;
export const MAX_ASSUMPTIONS_DISPLAY = 5;
export const TOP_N_ASSUMPTIONS_FOR_RECOMBINE = 10;

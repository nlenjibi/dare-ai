import { extractAndParse, DecompositionSchema, AuditSchema, LearningSchema } from "@/backend/module/ai/schema";

describe("extractAndParse", () => {
  test("test_extractAndParse_validJson_returnsSchema", () => {
    const raw = `Here is the result:\n{"requiresUserChoice":false,"deeperObjective":null,"components":[]}`;
    const result = extractAndParse(raw, DecompositionSchema);
    expect(result.requiresUserChoice).toBe(false);
    expect(result.components).toEqual([]);
  });

  test("test_extractAndParse_noJson_throws", () => {
    expect(() => extractAndParse("no json here", DecompositionSchema)).toThrow(
      "AI_SCHEMA_VALIDATION_FAILED"
    );
  });

  test("test_extractAndParse_invalidSchema_throws", () => {
    const raw = `{"wrong":"shape"}`;
    expect(() => extractAndParse(raw, DecompositionSchema)).toThrow();
  });

  test("test_extractAndParse_learningSchema_valid", () => {
    const raw = JSON.stringify({
      assumptionUpdates: [
        { assumptionId: "abc", newLifecycle: "SUPPORTED", reasoning: "Data confirmed it" },
      ],
      nextRecommendedAction: "Proceed to recombine",
      summary: "Experiment validated the assumption",
    });
    const result = extractAndParse(raw, LearningSchema);
    expect(result.assumptionUpdates).toHaveLength(1);
    expect(result.assumptionUpdates[0].newLifecycle).toBe("SUPPORTED");
  });

  test("test_extractAndParse_auditSchema_valid", () => {
    const raw = JSON.stringify({
      assumptions: [
        {
          id: "a1",
          componentId: null,
          statement: "Users want this",
          type: "ASSUMPTION",
          confidence: 0.5,
          loadBearingScore: 4,
          ifRemoved: "Product collapses",
          ifInverted: "Would need different approach",
        },
      ],
    });
    const result = extractAndParse(raw, AuditSchema);
    expect(result.assumptions[0].type).toBe("ASSUMPTION");
    expect(result.assumptions[0].loadBearingScore).toBe(4);
  });
});

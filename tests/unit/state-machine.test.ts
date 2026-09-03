import { canTransition, nextStage, assertTransition } from "@/backend/module/dare/state-machine";

describe("canTransition", () => {
  test("test_canTransition_notStartedToInProgress_returnsTrue", () => {
    expect(canTransition("NOT_STARTED", "IN_PROGRESS")).toBe(true);
  });

  test("test_canTransition_notStartedToCompleted_returnsFalse", () => {
    expect(canTransition("NOT_STARTED", "COMPLETED")).toBe(false);
  });

  test("test_canTransition_inProgressToCompleted_returnsTrue", () => {
    expect(canTransition("IN_PROGRESS", "COMPLETED")).toBe(true);
  });

  test("test_canTransition_inProgressToWaitingForUser_returnsTrue", () => {
    expect(canTransition("IN_PROGRESS", "WAITING_FOR_USER")).toBe(true);
  });

  test("test_canTransition_completedToInProgress_returnsTrue", () => {
    expect(canTransition("COMPLETED", "IN_PROGRESS")).toBe(true);
  });

  test("test_canTransition_completedToNotStarted_returnsFalse", () => {
    expect(canTransition("COMPLETED", "NOT_STARTED")).toBe(false);
  });

  test("test_canTransition_waitingForUserToInProgress_returnsTrue", () => {
    expect(canTransition("WAITING_FOR_USER", "IN_PROGRESS")).toBe(true);
  });

  test("test_canTransition_waitingForUserToBlocked_returnsFalse", () => {
    expect(canTransition("WAITING_FOR_USER", "BLOCKED")).toBe(false);
  });

  test("test_canTransition_needsRevisionToInProgress_returnsTrue", () => {
    expect(canTransition("NEEDS_REVISION", "IN_PROGRESS")).toBe(true);
  });

  test("test_canTransition_blockedToInProgress_returnsTrue", () => {
    expect(canTransition("BLOCKED", "IN_PROGRESS")).toBe(true);
  });
});

describe("nextStage", () => {
  test("test_nextStage_fromD_returnsA", () => {
    expect(nextStage("D")).toBe("A");
  });

  test("test_nextStage_fromA_returnsR", () => {
    expect(nextStage("A")).toBe("R");
  });

  test("test_nextStage_fromR_returnsE", () => {
    expect(nextStage("R")).toBe("E");
  });

  test("test_nextStage_fromE_returnsL", () => {
    expect(nextStage("E")).toBe("L");
  });

  test("test_nextStage_fromL_returnsNull", () => {
    expect(nextStage("L")).toBeNull();
  });
});

describe("assertTransition", () => {
  test("test_assertTransition_validTransition_doesNotThrow", () => {
    expect(() => assertTransition("NOT_STARTED", "IN_PROGRESS")).not.toThrow();
  });

  test("test_assertTransition_invalidTransition_throws", () => {
    expect(() => assertTransition("NOT_STARTED", "COMPLETED")).toThrow("INVALID_STAGE_TRANSITION");
  });
});

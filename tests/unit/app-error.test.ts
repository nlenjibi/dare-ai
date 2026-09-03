import { AppError, toApiError } from "@/common/exception/app-error";

describe("AppError", () => {
  test("test_AppError_defaultStatusCode_is500", () => {
    const err = new AppError("something went wrong");
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe("something went wrong");
    expect(err.name).toBe("AppError");
  });

  test("test_AppError_customStatusCode_usesProvided", () => {
    const err = new AppError("not found", 404);
    expect(err.statusCode).toBe(404);
  });
});

describe("toApiError", () => {
  test("test_toApiError_AppError_returnsItsFields", () => {
    const err = new AppError("forbidden", 403);
    expect(toApiError(err)).toEqual({ message: "forbidden", statusCode: 403 });
  });

  test("test_toApiError_projectNotFound_returns404", () => {
    expect(toApiError(new Error("PROJECT_NOT_FOUND"))).toEqual({
      message: "Project not found",
      statusCode: 404,
    });
  });

  test("test_toApiError_problemIntakeRequired_returns400", () => {
    expect(toApiError(new Error("PROBLEM_INTAKE_REQUIRED"))).toEqual({
      message: "Problem statement is required before this stage",
      statusCode: 400,
    });
  });

  test("test_toApiError_aiSchemaValidationFailed_returns502", () => {
    expect(toApiError(new Error("AI_SCHEMA_VALIDATION_FAILED: no JSON found"))).toEqual({
      message: "AI response was invalid — please try again",
      statusCode: 502,
    });
  });

  test("test_toApiError_invalidStageTransition_returns400", () => {
    expect(toApiError(new Error("INVALID_STAGE_TRANSITION: NOT_STARTED → COMPLETED"))).toEqual({
      message: "Invalid stage transition",
      statusCode: 400,
    });
  });

  test("test_toApiError_unknownError_returns500", () => {
    expect(toApiError(new Error("something unexpected"))).toEqual({
      message: "Internal server error",
      statusCode: 500,
    });
  });

  test("test_toApiError_nonError_returns500", () => {
    expect(toApiError("a string error")).toEqual({
      message: "Internal server error",
      statusCode: 500,
    });
  });
});

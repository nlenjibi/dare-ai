export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toApiError(err: unknown): { message: string; statusCode: number } {
  if (err instanceof AppError) {
    return { message: err.message, statusCode: err.statusCode };
  }
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes("PROJECT_NOT_FOUND")) return { message: "Project not found", statusCode: 404 };
    if (msg.includes("PROBLEM_INTAKE_REQUIRED")) return { message: "Problem statement is required before this stage", statusCode: 400 };
    if (msg.includes("DECOMPOSE_REQUIRED") || msg.includes("AUDIT_REQUIRED") || msg.includes("SOLUTIONS_REQUIRED")) {
      return { message: "Previous stage must be completed first", statusCode: 400 };
    }
    if (msg.includes("AI_SCHEMA_VALIDATION_FAILED")) return { message: "AI response was invalid — please try again", statusCode: 502 };
    if (msg.includes("INVALID_STAGE_TRANSITION")) return { message: "Invalid stage transition", statusCode: 400 };
  }
  return { message: "Internal server error", statusCode: 500 };
}

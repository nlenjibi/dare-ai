export interface UpsertProblemDto {
  statement: string;
  objective?: string;
  context?: string;
  constraints?: string;
}

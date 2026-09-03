export interface RecordDecisionDto {
  decision: string;
  selectedSolutionId?: string;
  confidence: number;
  evidenceSummary?: string;
  rejectedAlternatives: string[];
  reasoningSummary?: string;
  reviewDate?: string;
}

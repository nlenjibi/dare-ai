export interface AddEvidenceDto {
  type: string;
  claim: string;
  source?: string;
  reference?: string;
  confidence: number;
  verificationStatus: string;
}

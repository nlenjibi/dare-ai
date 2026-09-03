export interface AIRequest {
  systemPrompt: string;
  stagePrompt: string;
  context?: string;
  model?: string;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  durationMs: number;
}

export interface AIProvider {
  generate(input: AIRequest): Promise<AIResponse>;
}

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing: Record<string, { input: number; output: number }> = {
    "claude-opus-4-7":          { input: 0.000015, output: 0.000075 },
    "claude-sonnet-4-6":        { input: 0.000003, output: 0.000015 },
    "claude-haiku-4-5-20251001":{ input: 0.0000008, output: 0.000004 },
  };
  const p = pricing[model] ?? { input: 0.000003, output: 0.000015 };
  return inputTokens * p.input + outputTokens * p.output;
}

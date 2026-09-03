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
    // Anthropic
    "claude-opus-4-7":           { input: 0.000015,  output: 0.000075 },
    "claude-sonnet-4-6":         { input: 0.000003,  output: 0.000015 },
    "claude-haiku-4-5-20251001": { input: 0.0000008, output: 0.000004 },
    // OpenAI
    "gpt-4o":                    { input: 0.0000025, output: 0.000010 },
    "gpt-4o-mini":               { input: 0.00000015, output: 0.0000006 },
    "gpt-4-turbo":               { input: 0.000010,  output: 0.000030 },
    // Groq (very cheap — approximate)
    "llama-3.1-8b-instant":      { input: 0.00000005, output: 0.00000008 },
    "llama-3.3-70b-versatile":   { input: 0.00000059, output: 0.00000079 },
    "mixtral-8x7b-32768":        { input: 0.00000024, output: 0.00000024 },
    "gemma2-9b-it":              { input: 0.0000002,  output: 0.0000002 },
  };
  const p = pricing[model] ?? { input: 0.000003, output: 0.000015 };
  return inputTokens * p.input + outputTokens * p.output;
}

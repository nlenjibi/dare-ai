import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, AIRequest, AIResponse } from "./index";
import { estimateCost } from "./index";

export { estimateCost };

const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

export class AnthropicProvider implements AIProvider {
  async generate(input: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    const model = input.model ?? process.env.AI_MODEL ?? "claude-sonnet-4-6";
    const maxTokens = input.maxTokens ?? Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 4096);

    const userContent = input.context
      ? `${input.stagePrompt}\n\n${input.context}`
      : input.stagePrompt;

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: input.systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return {
      text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
      durationMs: Date.now() - start,
    };
  }
}

let _provider: AnthropicProvider | null = null;

export function getAIProvider(): AIProvider {
  _provider ??= new AnthropicProvider();
  return _provider;
}

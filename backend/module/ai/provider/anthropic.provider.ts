import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, AIRequest, AIResponse } from "./index";
import { estimateCost } from "./index";
import { OpenAICompatProvider } from "./openai-compat.provider";

export { estimateCost };

export class AnthropicProvider implements AIProvider {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async generate(input: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    const model = input.model ?? process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
    const maxTokens = input.maxTokens ?? Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 4096);

    const userContent = input.context
      ? `${input.stagePrompt}\n\n${input.context}`
      : input.stagePrompt;

    const response = await this.client.messages.create({
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

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = (process.env.AI_PROVIDER ?? "anthropic").toLowerCase();

  switch (providerName) {
    case "groq":
    case "openai":
      _provider = new OpenAICompatProvider(providerName);
      break;
    default:
      _provider = new AnthropicProvider();
  }

  return _provider;
}

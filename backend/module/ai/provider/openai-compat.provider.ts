import OpenAI from "openai";
import type { AIProvider, AIRequest, AIResponse } from "./index";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const OPENAI_BASE_URL = "https://api.openai.com/v1";

function buildClient(provider: string): { client: OpenAI; defaultModel: string } {
  switch (provider) {
    case "groq":
      return {
        client: new OpenAI({
          apiKey: process.env.GROQ_API_KEY ?? process.env.AI_API_KEY,
          baseURL: GROQ_BASE_URL,
        }),
        defaultModel: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
      };
    case "openai":
      return {
        client: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: OPENAI_BASE_URL,
        }),
        defaultModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      };
    default:
      throw new Error(`Unsupported OpenAI-compat provider: ${provider}`);
  }
}

export class OpenAICompatProvider implements AIProvider {
  private provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  async generate(input: AIRequest): Promise<AIResponse> {
    const { client, defaultModel } = buildClient(this.provider);
    const model = input.model ?? defaultModel;
    const maxTokens = input.maxTokens ?? Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 4096);
    const start = Date.now();

    const userContent = input.context
      ? `${input.stagePrompt}\n\n${input.context}`
      : input.stagePrompt;

    const response = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const text = response.choices.map((c) => c.message.content ?? "").join("\n");
    const usage = response.usage;

    return {
      text,
      inputTokens: usage?.prompt_tokens ?? 0,
      outputTokens: usage?.completion_tokens ?? 0,
      model: response.model,
      durationMs: Date.now() - start,
    };
  }
}

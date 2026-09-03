export const env = {
  mongodbUri: process.env.MONGODB_URI!,
  nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  aiReasoningModel: process.env.AI_REASONING_MODEL ?? "claude-opus-4-7",
  aiFastModel: process.env.AI_FAST_MODEL ?? "claude-haiku-4-5-20251001",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;

import OpenAI from "openai";
import { env } from "@/lib/env";

export const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function createJsonCompletion<T>(system: string, user: string, fallback: T): Promise<T> {
  if (!openai) return fallback;
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  const content = response.choices[0]?.message.content;
  if (!content) return fallback;
  return JSON.parse(content) as T;
}

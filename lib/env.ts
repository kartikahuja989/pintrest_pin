import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  REPLICATE_API_TOKEN: z.string().optional(),
  REPLICATE_IMAGE_MODEL: z.string().default("black-forest-labs/flux-schnell"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  PINTEREST_CLIENT_ID: z.string().optional(),
  PINTEREST_CLIENT_SECRET: z.string().optional(),
  PINTEREST_REDIRECT_URI: z.string().url().optional(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  APP_ENCRYPTION_KEY: z.string().min(16).optional(),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(60)
});

export const env = schema.parse(process.env);

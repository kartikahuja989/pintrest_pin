import { z } from "zod";

export const scrapeSchema = z.object({ url: z.string().url(), affiliateUrl: z.string().url().optional() });
export const contentSchema = z.object({ productId: z.string().min(1), variations: z.number().int().min(1).max(10).default(5) });
export const imageSchema = z.object({ pinId: z.string().min(1), variations: z.number().int().min(1).max(6).default(3), layout: z.string().default("editorial-collage") });
export const scheduleSchema = z.object({ pinId: z.string(), pinterestAccountId: z.string(), boardId: z.string(), scheduledFor: z.string().datetime() });
export const publishSchema = z.object({ pinId: z.string(), pinterestAccountId: z.string(), boardId: z.string() });
export const bulkSchema = z.object({ rows: z.array(z.object({ url: z.string().url(), affiliateUrl: z.string().url().optional() })).min(1).max(100) });

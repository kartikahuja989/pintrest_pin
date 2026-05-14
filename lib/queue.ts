import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/lib/env";

export const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const pinQueue = new Queue("pin-publishing", { connection });
export const bulkQueue = new Queue("bulk-generation", { connection });

export type PublishJob = { scheduledPostId: string };
export type BulkJob = { userId: string; rows: { url: string; affiliateUrl?: string }[] };

import { Worker } from "bullmq";
import { connection } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import { publishPin } from "@/services/pinterest";

export function startPinWorker() {
  return new Worker("pin-publishing", async (job) => {
    const post = await prisma.scheduledPost.findUniqueOrThrow({ where: { id: job.data.scheduledPostId } });
    try {
      await publishPin(post.generatedPinId, post.pinterestAccountId, post.boardId);
      await prisma.scheduledPost.update({ where: { id: post.id }, data: { status: "PUBLISHED" } });
    } catch (error) {
      await prisma.scheduledPost.update({ where: { id: post.id }, data: { status: "FAILED", failureReason: error instanceof Error ? error.message : "Unknown error" } });
      throw error;
    }
  }, { connection });
}

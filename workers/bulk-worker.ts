import { Worker } from "bullmq";
import { Prisma, ProductSource as DbProductSource } from "@prisma/client";
import { connection } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/services/scraper";
import { generatePinterestContent } from "@/services/ai-content";
import { generatePinterestImages } from "@/services/image-generation";
import type { ScrapedProduct } from "@/types";

export function startBulkWorker() {
  return new Worker("bulk-generation", async (job) => {
    const { userId, rows } = job.data as { userId: string; rows: { url: string; affiliateUrl?: string }[] };
    for (const row of rows) {
      const scraped = await scrapeProduct(row.url, row.affiliateUrl);
      const product = await prisma.product.create({ data: {
        userId,
        source: scraped.source as DbProductSource,
        sourceUrl: scraped.sourceUrl,
        affiliateUrl: scraped.affiliateUrl,
        title: scraped.title,
        brand: scraped.brand,
        price: scraped.price,
        currency: scraped.currency,
        category: scraped.category,
        gender: scraped.gender,
        fashionStyle: scraped.fashionStyle,
        imageUrls: scraped.imageUrls as Prisma.InputJsonValue,
        metadata: scraped.metadata as Prisma.InputJsonValue | undefined
      } });
      const content = await generatePinterestContent(scraped, 3);
      for (let i = 0; i < content.titles.length; i++) {
        const pin = await prisma.generatedPin.create({ data: { userId, productId: product.id, title: content.titles[i], description: content.descriptions[i % content.descriptions.length], tags: [...content.tags, ...content.hashtags], boardSuggestion: content.boards[i % content.boards.length], layout: content.layouts[i % content.layouts.length], destinationUrl: product.affiliateUrl ?? product.sourceUrl, status: "GENERATED" } });
        const images = await generatePinterestImages(product as unknown as ScrapedProduct, 1, pin.layout ?? "editorial-collage");
        await prisma.generatedImage.create({ data: { generatedPinId: pin.id, prompt: images[0].prompt, cloudinaryUrl: images[0].cloudinaryUrl, publicId: images[0].publicId, layout: images[0].layout } });
      }
    }
  }, { connection, concurrency: 2 });
}

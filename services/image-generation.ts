import Replicate from "replicate";
import { env } from "@/lib/env";
import { imageGenerationPrompt, negativeFacePrompt } from "@/prompts/image";
import type { ScrapedProduct } from "@/types";
import { uploadImageFromUrl } from "@/services/cloudinary";

export async function generatePinterestImages(product: ScrapedProduct, variations: number, layout: string) {
  const prompt = imageGenerationPrompt(product, layout);
  if (!env.REPLICATE_API_TOKEN) {
    return Array.from({ length: variations }, (_, i) => ({ prompt, cloudinaryUrl: product.imageUrls[i % Math.max(product.imageUrls.length, 1)] ?? "/fallback-pin.svg", publicId: undefined, layout }));
  }
  const replicate = new Replicate({ auth: env.REPLICATE_API_TOKEN });
  const results = [];
  for (let i = 0; i < variations; i++) {
    const output = await replicate.run(env.REPLICATE_IMAGE_MODEL as `${string}/${string}`, {
      input: { prompt, negative_prompt: negativeFacePrompt, aspect_ratio: "2:3", output_format: "webp" }
    });
    const url = Array.isArray(output) ? String(output[0]) : String(output);
    const uploaded = await uploadImageFromUrl(url);
    results.push({ prompt, cloudinaryUrl: uploaded.secure_url, publicId: uploaded.public_id, layout });
  }
  return results;
}


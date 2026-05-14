import type { ScrapedProduct } from "@/types";

export function pinterestSeoPrompt(product: ScrapedProduct, variations: number) {
  return `Create Pinterest fashion growth assets for this product. Return JSON only with keys titles, descriptions, tags, hashtags, boards, layouts. Need ${variations} high CTR title variations, ${variations} SEO descriptions with CTA, 25 tags, 20 hashtags, and board suggestions. Product: ${JSON.stringify(product)}. Use fashion keywords like men style, outfit ideas, glow up, streetwear, old money, sneakers, capsule wardrobe when relevant. Do not make medical, body-shaming, or deceptive claims.`;
}

export const pinterestSeoSystem = "You are a Pinterest SEO strategist for fashion affiliate creators. You write concise, viral, search-optimized copy while preserving truthfulness and brand safety.";

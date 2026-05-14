import type { ScrapedProduct } from "@/types";

export function outfitPrompt(product: ScrapedProduct) {
  return `Build a complete fashion outfit around this single product. Return JSON with pants, shoes, accessories, watches, aesthetic, rationale. Each item array should include name and keywords. Product: ${JSON.stringify(product)}. Make combinations realistic for Pinterest affiliate content and include old money, streetwear, minimalist, sneaker, glow-up angles when relevant.`;
}

export const outfitSystem = "You are an expert men's and women's fashion stylist for affiliate commerce. You recommend practical outfit combinations with strong Pinterest search demand.";

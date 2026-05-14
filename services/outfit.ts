import type { OutfitRecommendationResult, ScrapedProduct } from "@/types";
import { createJsonCompletion } from "@/lib/openai";
import { outfitPrompt, outfitSystem } from "@/prompts/outfit";

function fallback(product: ScrapedProduct): OutfitRecommendationResult {
  return {
    pants: [{ name: "Relaxed tailored trousers", keywords: ["pleated trousers", "neutral pants", "old money pants"] }],
    shoes: [{ name: "Minimal leather sneakers", keywords: ["white sneakers", "clean sneakers", "men sneaker outfit"] }],
    accessories: [{ name: "Structured belt and sunglasses", keywords: ["men accessories", "minimal sunglasses"] }],
    watches: [{ name: "Slim silver watch", keywords: ["men watch", "minimal watch"] }],
    aesthetic: product.fashionStyle ?? "minimal premium",
    rationale: `The outfit balances ${product.title} with clean, searchable Pinterest staples that work for affiliate styling.`
  };
}

export async function buildOutfit(product: ScrapedProduct) {
  return createJsonCompletion<OutfitRecommendationResult>(outfitSystem, outfitPrompt(product), fallback(product));
}

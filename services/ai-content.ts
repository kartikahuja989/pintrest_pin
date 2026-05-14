import type { GeneratedContent, ScrapedProduct } from "@/types";
import { createJsonCompletion } from "@/lib/openai";
import { pinterestSeoPrompt, pinterestSeoSystem } from "@/prompts/pinterest";

function fallback(product: ScrapedProduct, variations: number): GeneratedContent {
  const base = product.fashionStyle === "old money" ? "Old Money Outfit Ideas" : product.fashionStyle === "streetwear" ? "Streetwear Outfit Ideas" : "Outfits That Look Expensive";
  return {
    titles: Array.from({ length: variations }, (_, i) => `${base} #${i + 1}`),
    descriptions: Array.from({ length: variations }, () => `Style ${product.title} with premium outfit essentials. Save this Pinterest fashion idea for your next glow-up look and shop the product from the linked store.`),
    tags: ["men fashion", "outfit ideas", "streetwear", "old money", "sneakers", "men glow up", "fashion inspo", "capsule wardrobe"],
    hashtags: ["#mensfashion", "#outfitideas", "#streetwear", "#oldmoney", "#glowup"],
    boards: ["Men Fashion", "Streetwear", "Sneakers", "Old Money", "Men Glow Up"],
    layouts: ["editorial-collage", "flat-lay", "hidden-face-mirror", "cropped-outfit"]
  };
}

export async function generatePinterestContent(product: ScrapedProduct, variations = 5) {
  return createJsonCompletion<GeneratedContent>(pinterestSeoSystem, pinterestSeoPrompt(product, variations), fallback(product, variations));
}

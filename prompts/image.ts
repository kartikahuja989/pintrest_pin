import type { ScrapedProduct } from "@/types";

export function imageGenerationPrompt(product: ScrapedProduct, layout: string) {
  return `Pinterest vertical fashion image, 1000x1500, ${layout}, luxury editorial collage, premium magazine styling, faceless only, no visible faces, cropped outfits, hidden-face mirror selfie angle, flat lay clothing composition, product inspired by ${product.title}, ${product.brand ?? "fashion brand"}, ${product.category ?? "fashion"}, ${product.fashionStyle ?? "modern aesthetic"}, clean negative space for Pinterest, realistic textile detail, no logos unless present on product, no readable text, no watermark.`;
}

export const negativeFacePrompt = "visible face, eyes, facial features, portrait, headshot, child, celebrity, distorted hands, extra limbs, watermark, readable text, low quality";

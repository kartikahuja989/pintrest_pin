export type ProductSource = "AMAZON" | "FLIPKART" | "MYNTRA" | "EARNKARO" | "OTHER";

export type ScrapedProduct = {
  source: ProductSource;
  sourceUrl: string;
  affiliateUrl?: string;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  category?: string;
  gender?: string;
  fashionStyle?: string;
  imageUrls: string[];
  metadata?: Record<string, unknown>;
};

export type GeneratedContent = {
  titles: string[];
  descriptions: string[];
  tags: string[];
  hashtags: string[];
  boards: string[];
  layouts: string[];
};

export type OutfitRecommendationResult = {
  pants: Array<{ name: string; keywords: string[] }>;
  shoes: Array<{ name: string; keywords: string[] }>;
  accessories: Array<{ name: string; keywords: string[] }>;
  watches: Array<{ name: string; keywords: string[] }>;
  aesthetic: string;
  rationale: string;
};

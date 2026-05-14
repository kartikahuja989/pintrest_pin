import * as cheerio from "cheerio";
import type { ProductSource, ScrapedProduct } from "@/types";

function detectSource(url: string): ProductSource {
  const host = new URL(url).hostname.toLowerCase();
  if (host.includes("amazon")) return "AMAZON";
  if (host.includes("flipkart")) return "FLIPKART";
  if (host.includes("myntra")) return "MYNTRA";
  if (host.includes("earnkaro")) return "EARNKARO";
  return "OTHER";
}

function firstText($: cheerio.CheerioAPI, selectors: string[]) {
  for (const selector of selectors) {
    const value = $(selector).first().text().replace(/\s+/g, " ").trim();
    if (value) return value;
  }
  return undefined;
}

function meta($: cheerio.CheerioAPI, names: string[]) {
  for (const name of names) {
    const value = $(`meta[property="${name}"], meta[name="${name}"]`).attr("content");
    if (value) return value.trim();
  }
  return undefined;
}

function extractImages($: cheerio.CheerioAPI) {
  const values = new Set<string>();
  ["og:image", "twitter:image"].forEach((key) => {
    const value = meta($, [key]);
    if (value) values.add(value);
  });
  $("img").each((_, el) => {
    const src = $(el).attr("src") ?? $(el).attr("data-src");
    if (src?.startsWith("http")) values.add(src);
  });
  return [...values].slice(0, 8);
}

function parsePrice(raw?: string) {
  if (!raw) return undefined;
  const match = raw.replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
  return match ? Number(match[1]) : undefined;
}

function inferStyle(title: string, category?: string) {
  const text = `${title} ${category ?? ""}`.toLowerCase();
  if (text.includes("sneaker") || text.includes("street")) return "streetwear";
  if (text.includes("linen") || text.includes("loafer") || text.includes("polo")) return "old money";
  if (text.includes("gym") || text.includes("sport")) return "athleisure";
  return "minimal premium";
}

export async function scrapeProduct(url: string, affiliateUrl?: string): Promise<ScrapedProduct> {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 PinFashionAI/1.0" }, next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Unable to scrape product: ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = firstText($, ["#productTitle", ".B_NuCI", ".pdp-title", "h1"]) ?? meta($, ["og:title", "twitter:title"]) ?? "Fashion product";
  const brand = firstText($, ["#bylineInfo", ".G6XhRU", ".pdp-title", "[data-testid='brand']"]);
  const priceText = firstText($, [".a-price .a-offscreen", "._30jeq3", ".pdp-price", "[itemprop='price']"]) ?? meta($, ["product:price:amount"]);
  const category = meta($, ["product:category", "article:section"]) ?? firstText($, [".breadcrumbs", ".a-breadcrumb"]);
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  return {
    source: detectSource(url),
    sourceUrl: url,
    affiliateUrl,
    title: cleanTitle,
    brand: brand?.replace(/^Brand:\s*/i, "").trim(),
    price: parsePrice(priceText),
    currency: priceText?.includes("$") ? "USD" : "INR",
    category,
    gender: /women|female|girl/i.test(cleanTitle + category) ? "women" : /men|male|guy/i.test(cleanTitle + category) ? "men" : "unisex",
    fashionStyle: inferStyle(cleanTitle, category),
    imageUrls: extractImages($),
    metadata: { scrapedAt: new Date().toISOString(), priceText }
  };
}

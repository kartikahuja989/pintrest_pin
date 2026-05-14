"use client";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Pin = { id: string; title: string; description: string; boardSuggestion?: string; layout?: string };

export function PinComposer() {
  const [url, setUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [productId, setProductId] = useState<string>();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState<string>();
  const [error, setError] = useState<string>();

  async function scrape() {
    setLoading("scrape"); setError(undefined);
    const res = await fetch("/api/scrape", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, affiliateUrl: affiliateUrl || undefined }) });
    const data = await res.json(); setLoading(undefined);
    if (!res.ok) return setError(data.error ?? "Scrape failed");
    setProductId(data.product.id);
  }

  async function generate() {
    if (!productId) return;
    setLoading("content"); setError(undefined);
    const res = await fetch("/api/generate/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, variations: 5 }) });
    const data = await res.json(); setLoading(undefined);
    if (!res.ok) return setError(data.error ?? "Generation failed");
    setPins(data.pins);
  }

  async function generateImages(pinId: string) {
    setLoading(pinId); setError(undefined);
    const res = await fetch("/api/generate/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinId, variations: 3, layout: "editorial-collage" }) });
    const data = await res.json(); setLoading(undefined);
    if (!res.ok) setError(data.error ?? "Image generation failed");
  }

  return <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
    <Card className="glass"><CardHeader><CardTitle>Create Pin</CardTitle><CardDescription>Paste a product or affiliate link. The app extracts product data and generates Pinterest assets.</CardDescription></CardHeader><CardContent className="space-y-3"><Input placeholder="Amazon, Flipkart, Myntra, or EarnKaro product URL" value={url} onChange={(e) => setUrl(e.target.value)} /><Input placeholder="Optional EarnKaro affiliate URL" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} /><div className="flex gap-2"><Button onClick={scrape} disabled={!url || loading === "scrape"}>{loading === "scrape" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Scrape</Button><Button variant="secondary" onClick={generate} disabled={!productId || loading === "content"}>{loading === "content" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate SEO</Button></div>{productId && <Badge>Product saved</Badge>}{error && <p className="text-sm text-destructive">{error}</p>}</CardContent></Card>
    <div className="grid gap-4 md:grid-cols-2">{pins.map((pin) => <Card key={pin.id}><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">{pin.title}</CardTitle><Badge>{pin.boardSuggestion}</Badge></div><CardDescription>{pin.layout}</CardDescription></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">{pin.description}</p><Button variant="outline" onClick={() => generateImages(pin.id)} disabled={loading === pin.id}>{loading === pin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate Images</Button></CardContent></Card>)}</div>
  </div>;
}

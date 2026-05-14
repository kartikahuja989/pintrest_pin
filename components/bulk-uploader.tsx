"use client";
import { useState } from "react";
import Papa from "papaparse";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Row = { url: string; affiliateUrl?: string };

export function BulkUploader() {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState("");
  async function onFile(file?: File) {
    if (!file) return;
    Papa.parse<Row>(file, { header: true, skipEmptyLines: true, complete: (result) => setRows(result.data.filter((row) => row.url)) });
  }
  async function queue() {
    const res = await fetch("/api/bulk/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }) });
    const data = await res.json();
    setMessage(res.ok ? `Queued ${data.queued} products. Job ${data.jobId}` : data.error);
  }
  return <Card className="glass"><CardHeader><CardTitle>Bulk Generator</CardTitle><CardDescription>Upload a CSV with url and affiliateUrl columns to generate 30+ pins asynchronously.</CardDescription></CardHeader><CardContent className="space-y-4"><label className="grid h-40 cursor-pointer place-items-center rounded-lg border border-dashed bg-background/60"><input className="hidden" type="file" accept=".csv" onChange={(e) => onFile(e.target.files?.[0])} /><span className="flex items-center gap-2 text-sm font-medium"><UploadCloud className="h-5 w-5" /> Upload CSV</span></label><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{rows.length} rows ready</p><Button onClick={queue} disabled={!rows.length}>Queue Bulk Job</Button></div>{message && <p className="text-sm text-muted-foreground">{message}</p>}</CardContent></Card>;
}

import Papa from "papaparse";
export type BulkCsvRow = { url: string; affiliateUrl?: string };
export function parseBulkCsv(csv: string) { return Papa.parse<BulkCsvRow>(csv, { header: true, skipEmptyLines: true }).data.filter((row) => row.url); }

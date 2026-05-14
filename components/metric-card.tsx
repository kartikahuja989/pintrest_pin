import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
export function MetricCard({ title, value }: { title: string; value: number }) { return <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader><CardContent><p className="text-3xl font-black">{formatNumber(value)}</p></CardContent></Card>; }

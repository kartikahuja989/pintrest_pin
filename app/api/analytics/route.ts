import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { secureJson } from "@/lib/security";

export async function GET() {
  try {
    const user = await requireUser();
    const pins = await prisma.generatedPin.findMany({ where: { userId: user.id }, include: { analytics: true, images: true }, orderBy: { createdAt: "desc" }, take: 50 });
    const totals = pins.flatMap((p) => p.analytics).reduce((acc, row) => ({ impressions: acc.impressions + row.impressions, saves: acc.saves + row.saves, clicks: acc.clicks + row.clicks }), { impressions: 0, saves: 0, clicks: 0 });
    return secureJson({ totals, pins });
  } catch (error) {
    return secureJson({ error: error instanceof Error ? error.message : "Analytics failed" }, { status: 400 });
  }
}

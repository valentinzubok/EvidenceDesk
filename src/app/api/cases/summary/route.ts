import { NextResponse } from "next/server";
import { getCaseStats, listCaseIds } from "@/lib/contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [ids, stats] = await Promise.all([listCaseIds(), getCaseStats()]);
    const clean = stats?.clean ?? 0;
    const tampered = stats?.tampered ?? 0;
    return NextResponse.json({
      total: ids.length,
      open: ids.length,
      closed: 0,
      clean,
      tampered,
      stats,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[api/cases/summary]", e);
    return NextResponse.json({ error: "Failed to aggregate case summary" }, { status: 502 });
  }
}

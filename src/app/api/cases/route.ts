import { NextResponse } from "next/server";
import { listCaseIds } from "@/lib/contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ids = await listCaseIds();
    return NextResponse.json({ ids, count: ids.length });
  } catch (e) {
    console.error("[api/cases]", e);
    return NextResponse.json({ error: "Failed to list cases from Studionet" }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { listCaseIds } from "@/lib/contracts";
import { paginateWithCursor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ids = await listCaseIds();
    const cursor = request.nextUrl.searchParams.get("cursor");
    const limitRaw = Number(request.nextUrl.searchParams.get("limit") ?? "20");
    const limit = Math.min(Math.max(limitRaw, 1), 100);

    const page = paginateWithCursor(ids, cursor, limit);
    return NextResponse.json({
      ids: page.items,
      count: page.items.length,
      total: page.total,
      nextCursor: page.nextCursor,
    });
  } catch (e) {
    console.error("[api/cases]", e);
    return NextResponse.json({ error: "Failed to list cases from Studionet" }, { status: 502 });
  }
}

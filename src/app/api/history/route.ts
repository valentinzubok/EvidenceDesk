import { NextRequest, NextResponse } from "next/server";
import { listCaseIds } from "@/lib/contracts";

export const dynamic = "force-dynamic";

/**
 * Validates client-side recent/favorite IDs against on-chain cases.
 * Favorites and recents are stored in localStorage; this endpoint confirms which IDs still exist.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ids") ?? "";
  const requested = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (requested.length === 0) {
    return NextResponse.json({
      ids: [],
      valid: [],
      source: "client-localStorage",
      hint: "Pass ?ids=case-a,case-b to validate favorites/recent against chain",
    });
  }

  try {
    const onChain = new Set(await listCaseIds());
    const valid = requested.filter((id) => onChain.has(id));
    return NextResponse.json({ ids: requested, valid, count: valid.length });
  } catch (e) {
    console.error("[api/history]", e);
    return NextResponse.json({ error: "Failed to validate case IDs" }, { status: 502 });
  }
}

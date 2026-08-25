import { NextRequest, NextResponse } from "next/server";
import { getOnChainRole } from "@/lib/contracts-extended";
import { RBAC_ADDRESS } from "@/lib/config";
import type { Address } from "@/lib/genlayer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const account = request.nextUrl.searchParams.get("account") as Address | null;
  if (!account) {
    return NextResponse.json({ error: "account query param required" }, { status: 400 });
  }
  if (!RBAC_ADDRESS) {
    return NextResponse.json({
      role: null,
      source: "localStorage-demo",
      configured: false,
      hint: "Set NEXT_PUBLIC_RBAC_ADDRESS when RBAC contract is deployed",
    });
  }
  const role = await getOnChainRole(account);
  return NextResponse.json({ role, source: "on-chain", configured: true, contract: RBAC_ADDRESS });
}

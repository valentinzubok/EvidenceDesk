import { NextRequest, NextResponse } from "next/server";
import { createDeskViaFactory, listFactoryDesks } from "@/lib/contracts-extended";
import { FACTORY_ADDRESS } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!FACTORY_ADDRESS) {
    return NextResponse.json({
      desks: [],
      configured: false,
      hint: "Set NEXT_PUBLIC_FACTORY_ADDRESS after deploying EvidenceDeskFactory",
    });
  }
  const desks = await listFactoryDesks();
  return NextResponse.json({ desks, configured: true });
}

export async function POST(request: NextRequest) {
  if (!FACTORY_ADDRESS) {
    return NextResponse.json({ error: "Factory contract not configured" }, { status: 501 });
  }
  try {
    const body = (await request.json()) as {
      account?: string;
      deskName?: string;
    };
    if (!body.account || !body.deskName) {
      return NextResponse.json({ error: "account and deskName required" }, { status: 400 });
    }
    return NextResponse.json({
      message: "Use client-side wallet to call create_desk",
      factory: FACTORY_ADDRESS,
      deskName: body.deskName,
    });
  } catch (e) {
    console.error("[api/factory]", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

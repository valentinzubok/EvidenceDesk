import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type BatchPayload = { caseId: string; urlsJson: string }[];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { cases?: BatchPayload };
    const cases = body.cases ?? [];
    if (cases.length === 0) {
      return NextResponse.json({ error: "cases array required" }, { status: 400 });
    }
    if (cases.length > 10) {
      return NextResponse.json({ error: "Max 10 cases per batch" }, { status: 400 });
    }
    return NextResponse.json({
      message: "Submit batch_open_cases from connected wallet via genlayer-js",
      method: "batch_open_cases",
      count: cases.length,
      cases,
    });
  } catch (e) {
    console.error("[api/cases/batch]", e);
    return NextResponse.json({ error: "Invalid batch payload" }, { status: 400 });
  }
}

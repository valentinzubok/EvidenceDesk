import { NextRequest, NextResponse } from "next/server";

/** Rule-based criteria draft (LLM hook: set OPENAI_API_KEY for future upgrade). */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { description?: string; caseId?: string };
    const description = (body.description ?? "").trim().slice(0, 2000);
    if (!description) {
      return NextResponse.json({ error: "description required" }, { status: 400 });
    }

    const title = body.caseId ? `Criteria for ${body.caseId}` : "Generated criteria";
    const prompt = `# ${title}

## Context
${description}

## Evaluation rules
- PASS if frozen content hash matches live fetch for each evidence URL
- FAIL if HTTP status is 4xx/5xx or hash differs from EvidenceSnapshot record
- Note redirects (follow up to 3 hops) and document any drift in preview text
- Flag tampered=true when cross_check detects mismatch

## Output
Return a concise verdict: PASS | FAIL with one-sentence rationale per URL.
`;

    return NextResponse.json({
      title,
      body: prompt,
      source: process.env.OPENAI_API_KEY ? "template+llm-ready" : "template",
    });
  } catch (e) {
    console.error("[api/ai/suggest-criteria]", e);
    return NextResponse.json({ error: "Failed to generate criteria" }, { status: 500 });
  }
}

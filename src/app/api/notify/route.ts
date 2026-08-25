import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type NotifyBody = {
  channel?: "telegram" | "email";
  message?: string;
  email?: string;
  event?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NotifyBody;
    const message = (body.message ?? "").trim().slice(0, 2000);
    const event = body.event ?? "evidence-desk";
    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const results: string[] = [];

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    if (body.channel !== "email" && tgToken && tgChat) {
      const text = encodeURIComponent(`[${event}] ${message}`);
      const url = `https://api.telegram.org/bot${tgToken}/sendMessage?chat_id=${tgChat}&text=${text}`;
      const res = await fetch(url);
      if (res.ok) results.push("telegram");
    }

    const smtpUrl = process.env.NOTIFY_WEBHOOK_URL;
    if (body.channel === "email" && smtpUrl) {
      const res = await fetch(smtpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: body.email ?? process.env.NOTIFY_EMAIL_TO,
          subject: `[Evidence Desk] ${event}`,
          text: message,
        }),
      });
      if (res.ok) results.push("email");
    }

    if (results.length === 0) {
      return NextResponse.json({
        ok: false,
        hint: "Configure TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID or NOTIFY_WEBHOOK_URL",
      });
    }

    return NextResponse.json({ ok: true, sent: results });
  } catch (e) {
    console.error("[api/notify]", e);
    return NextResponse.json({ error: "Notify failed" }, { status: 500 });
  }
}

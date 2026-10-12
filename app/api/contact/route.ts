import { NextResponse } from "next/server";
import { profile } from "@/lib/data";

// Mesajları Resend vasitəsilə e-poçta göndərir.
// Lazım olan env: RESEND_API_KEY (bax .env.example)
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  // Botlar üçün gizli sahə: doludursa, səssizcə "uğurlu" qaytarırıq
  if (body.company) return NextResponse.json({ ok: true });

  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || message.length < 5 || message.length > 5000) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? profile.email,
      reply_to: email,
      subject: `Portfolio: ${name}`,
      text: `Ad: ${name}\nE-poçt: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

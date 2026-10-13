import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

// Terminaldakı qonaq kitabı: GET — son mesajlar, POST — yeni mesaj.
// Məlumat Netlify Blobs-da saxlanılır (pulsuz, ayrıca verilənlər bazası lazım deyil).
export const dynamic = "force-dynamic";

type Entry = { name: string; message: string; at: number };

const MAX_ENTRIES = 50;
const RATE_WINDOW_MS = 10 * 60 * 1000; // bir IP-dən 10 dəqiqədə bir mesaj

// Yalnız sadə mətn: idarəedici simvollar silinir, boşluqlar sıxılır
const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

function store() {
  try {
    return getStore({ name: "guestbook", consistency: "strong" });
  } catch {
    return null; // lokal dev-də Netlify konteksti yoxdur
  }
}

async function readEntries(s: NonNullable<ReturnType<typeof store>>): Promise<Entry[]> {
  return ((await s.get("entries", { type: "json" })) as Entry[] | null) ?? [];
}

export async function GET() {
  const s = store();
  if (!s) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  try {
    const entries = await readEntries(s);
    return NextResponse.json({ entries: entries.slice(0, 20) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const s = store();
  if (!s) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const name = clean(body.name, 24);
  const message = clean(body.message, 140);
  if (name.length < 2 || message.length < 2) return NextResponse.json({ error: "invalid" }, { status: 400 });
  // Spam əleyhinə: linklərə icazə yoxdur
  if (/(https?:\/\/|www\.|\.(com|net|org|ru|xyz|io)\b)/i.test(name + " " + message)) {
    return NextResponse.json({ error: "links" }, { status: 400 });
  }

  // IP özü saxlanılmır, yalnız heşi
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const ipKey = "rate/" + createHash("sha256").update(ip).digest("hex").slice(0, 24);
  try {
    const last = Number(await s.get(ipKey)) || 0;
    if (Date.now() - last < RATE_WINDOW_MS) return NextResponse.json({ error: "rate" }, { status: 429 });

    const entries = await readEntries(s);
    const entry: Entry = { name, message, at: Date.now() };
    await s.setJSON("entries", [entry, ...entries].slice(0, MAX_ENTRIES));
    await s.set(ipKey, String(Date.now()));
    return NextResponse.json({ ok: true, entry });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

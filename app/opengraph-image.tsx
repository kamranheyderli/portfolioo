import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// LinkedIn, Telegram və s.-də link paylaşılanda görünən şəkil
export default async function OgImage() {
  const photo = await readFile(path.join(process.cwd(), "public", "kamran.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const tags = ["React", "Next.js", "TypeScript", "Redux", "Micro-Frontend"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 64, padding: "0 80px",
          background: "radial-gradient(ellipse at top left, #2a1f66 0%, #07070d 60%)", color: "#f1f1f7",
        }}
      >
        <img src={src} width={340} height={340} style={{ borderRadius: 40, border: "4px solid #7c5cff" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: "#9a9ab0" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#00ffa3" }} />
            Open to new projects
          </div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, marginTop: 24, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 40, marginTop: 16, color: "#7ee0ff" }}>{profile.role}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
            {tags.map((t) => (
              <div key={t} style={{ fontSize: 22, padding: "8px 18px", borderRadius: 99, border: "1px solid rgba(255,255,255,.2)", color: "#c8c8da" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}

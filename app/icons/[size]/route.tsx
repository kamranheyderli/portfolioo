import { ImageResponse } from "next/og";

// PWA ikonları ("KH." loqosu) build zamanı statik PNG kimi yaradılır: /icons/192, /icons/512, /icons/maskable
export const dynamic = "force-static";
export const generateStaticParams = () => [{ size: "192" }, { size: "512" }, { size: "maskable" }];

export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const maskable = size === "maskable";
  const px = size === "192" ? 192 : 512;
  // Maskable ikonda Android kənarları kəsə bilər — loqo mərkəzdə daha kiçik olur
  const font = Math.round(px * (maskable ? 0.3 : 0.42));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #2a1f66 0%, #07070d 70%)",
          borderRadius: maskable ? 0 : px * 0.22,
        }}
      >
        <div style={{ display: "flex", fontSize: font, fontWeight: 800, letterSpacing: -font * 0.06, color: "#f1f1f7" }}>
          KH<span style={{ color: "#00d4ff" }}>.</span>
        </div>
      </div>
    ),
    { width: px, height: px },
  );
}

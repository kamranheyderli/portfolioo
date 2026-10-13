import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";

// Telefona "tətbiq kimi" quraşdırma üçün
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: "Kamran",
    description: "Portfolio of Kamran Heyderli, Front-end Engineer from Baku.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07070d",
    theme_color: "#07070d",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

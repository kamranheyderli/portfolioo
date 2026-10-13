// Saytın əsas rəng palitrası (--c1, --c2, --c3). Seçim yadda qalır və <head>-dəki skriptlə ilk rəngləmədən əvvəl tətbiq olunur
import type { AccentId } from "./i18n-more";
import { unlock } from "./achievements";

export const ACCENTS: AccentId[] = ["violet", "emerald", "sunset", "ocean"];
export const ACCENT_KEY = "accent";
export const ACCENT_EVENT = "accent-change";

// Düymələrdəki kiçik nümunə rənglər (tünd tema)
export const SWATCH: Record<AccentId, [string, string]> = {
  violet: ["#7c5cff", "#00d4ff"],
  emerald: ["#10b981", "#22d3ee"],
  sunset: ["#f97316", "#f43f5e"],
  ocean: ["#3b82f6", "#06b6d4"],
};

export function getAccent(): AccentId {
  if (typeof document === "undefined") return "violet";
  const a = document.documentElement.dataset.accent as AccentId | undefined;
  return a && ACCENTS.includes(a) ? a : "violet";
}

export function setAccent(a: AccentId) {
  if (a === "violet") delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = a;
  try {
    localStorage.setItem(ACCENT_KEY, a);
  } catch {}
  window.dispatchEvent(new Event(ACCENT_EVENT));
  if (a !== "violet") unlock("color");
}

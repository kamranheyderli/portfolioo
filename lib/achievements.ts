// Saytdakı gizli şeyləri tapmaq üçün nailiyyətlər — brauzerdə (localStorage) yadda qalır
import type { AchievementId } from "./i18n-more";

export const ACHIEVEMENTS: AchievementId[] = ["terminal", "snake", "typing", "matrix", "retro", "burst", "color", "gitlog", "guestbook"];
export const ACHIEVEMENT_EVENT = "achievement-unlocked";

const KEY = "achievements";
const listeners = new Set<() => void>();
let cache: AchievementId[] | null = null;

export function getUnlocked(): AchievementId[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(raw) ? raw.filter((x): x is AchievementId => ACHIEVEMENTS.includes(x)) : [];
  } catch {
    cache = [];
  }
  return cache;
}

export function subscribeAchievements(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function unlock(id: AchievementId) {
  if (typeof window === "undefined" || getUnlocked().includes(id)) return;
  cache = [...getUnlocked(), id];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent(ACHIEVEMENT_EVENT, { detail: { id, all: cache.length === ACHIEVEMENTS.length } }));
}

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useM } from "./LangProvider";
import { ACHIEVEMENTS, getUnlocked, subscribeAchievements } from "@/lib/achievements";
import { ACCENTS, ACCENT_EVENT, SWATCH, getAccent, setAccent } from "@/lib/accent";
import { MUSIC_EVENT, isMusicOn, toggleMusic } from "@/lib/music";
import { OPEN_SHORTCUTS_EVENT } from "@/lib/events";

const subscribeTo = (event: string) => (cb: () => void) => {
  addEventListener(event, cb);
  return () => removeEventListener(event, cb);
};
const subAccent = subscribeTo(ACCENT_EVENT);
const subMusic = subscribeTo(MUSIC_EVENT);
const EMPTY: never[] = [];


// "?" düyməsi ilə saytdakı bütün qısayolları və gizli şeyləri göstərir
// Pəncərə ilk dəfə "?" basılanda yüklənir (bax: ShortcutsHelp.tsx)
export default function ShortcutsPanel({ initialOpen = false }: { initialOpen?: boolean }) {
  const m = useM();
  const k = m.keys;
  const unlocked = useSyncExternalStore(subscribeAchievements, getUnlocked, () => EMPTY);
  const accent = useSyncExternalStore(subAccent, getAccent, () => "violet" as const);
  const music = useSyncExternalStore(subMusic, isMusicOn, () => false);
  const [open, setOpen] = useState(initialOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, [contenteditable], .snake, .term")) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    addEventListener("keydown", onKey);
    addEventListener(OPEN_SHORTCUTS_EVENT, onOpen);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener(OPEN_SHORTCUTS_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    addEventListener("keydown", onEsc, true);
    return () => removeEventListener("keydown", onEsc, true);
  }, [open]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="qr-overlay" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="keys-modal glass"
            role="dialog"
            aria-modal="true"
            aria-label={k.title}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <h3>{k.title}</h3>
            <dl>
              {k.items.map((it) => (
                <div key={it.keys}>
                  <dt>{it.keys.split(" / ").map((part, i) => <kbd key={i}>{part}</kbd>)}</dt>
                  <dd>{it.text}</dd>
                </div>
              ))}
            </dl>

            <div className="keys-settings">
              <div className="keys-row">
                <span className="keys-label">{m.accent.title}</span>
                <div className="swatches" role="radiogroup" aria-label={m.accent.title}>
                  {ACCENTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      role="radio"
                      aria-checked={accent === a}
                      aria-label={m.accent.names[a]}
                      title={m.accent.names[a]}
                      className={`swatch${accent === a ? " active" : ""}`}
                      style={{ background: `linear-gradient(135deg, ${SWATCH[a][0]}, ${SWATCH[a][1]})` }}
                      onClick={() => setAccent(a)}
                      data-hover
                    />
                  ))}
                </div>
              </div>
              <div className="keys-row">
                <span className="keys-label">{m.music.title}</span>
                <button type="button" className={`music-toggle${music ? " on" : ""}`} onClick={toggleMusic} aria-pressed={music} data-hover>
                  <span className="eq" aria-hidden><i /><i /><i /></span>
                  {music ? m.music.on : m.music.off}
                </button>
              </div>
            </div>

            <div className="ach">
              <div className="ach-head">
                <span className="keys-label">{m.ach.title}</span>
                <span className="ach-progress">{m.ach.progress.replace("{n}", String(unlocked.length)).replace("{total}", String(ACHIEVEMENTS.length))}</span>
              </div>
              <div className="ach-bar"><span style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }} /></div>
              <ul className="ach-grid">
                {ACHIEVEMENTS.map((id) => {
                  const got = unlocked.includes(id);
                  return (
                    <li key={id} className={got ? "got" : ""} title={got ? m.ach.names[id] : m.ach.locked}>
                      <span className="ach-icon" aria-hidden>{got ? "🏆" : "🔒"}</span>
                      <span className="ach-name">{got ? m.ach.names[id] : "???"}</span>
                      <code>{m.ach.hints[id]}</code>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} autoFocus data-hover>{k.close}</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

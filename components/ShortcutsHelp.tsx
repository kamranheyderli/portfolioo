"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useM } from "./LangProvider";

export const OPEN_SHORTCUTS_EVENT = "open-shortcuts";

// "?" düyməsi ilə saytdakı bütün qısayolları və gizli şeyləri göstərir
export default function ShortcutsHelp() {
  const k = useM().keys;
  const [open, setOpen] = useState(false);
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
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} autoFocus data-hover>{k.close}</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

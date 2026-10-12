"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isSoundOn, play, setSoundOn, subscribeSound } from "@/lib/sound";

const CLICKABLE = "a, button, [data-hover], [role='button']";

export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  // Saytdakı bütün kliklənən elementlər üçün incə "klik" səsi
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (el && !el.closest("[data-sound='none']")) play("click");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const toggle = () => {
    setSoundOn(!on);
    if (!on) play("toggle", { force: true });
  };

  return (
    <button
      className="theme-toggle sound-toggle glass"
      onClick={toggle}
      aria-label={on ? "Mute sounds" : "Enable sounds"}
      aria-pressed={on}
      title={on ? "Sound: on" : "Sound: off"}
      data-hover
      data-sound="none"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={on ? "on" : "off"}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          {on ? (
            // Səs dalğaları
            <>
              <motion.path d="M15.5 8.5a5 5 0 0 1 0 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
              <motion.path d="M18.5 5.5a9 9 0 0 1 0 13" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} />
            </>
          ) : (
            <path d="M16 9l6 6M22 9l-6 6" />
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}

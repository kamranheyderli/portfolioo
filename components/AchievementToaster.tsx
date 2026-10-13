"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ACHIEVEMENT_EVENT } from "@/lib/achievements";
import type { AchievementId } from "@/lib/i18n-more";
import { play } from "@/lib/sound";
import { toast } from "@/lib/toast";
import { useM } from "./LangProvider";

const COLORS = ["var(--c1)", "var(--c2)", "var(--c3)", "#fbbf24", "#10b981"];

// Yeni sirr tapılanda bildiriş göstərir; hamısı tapılanda ekranda konfetti
export default function AchievementToaster() {
  const a = useM().ach;
  const aRef = useRef(a);
  aRef.current = a;
  const [confetti, setConfetti] = useState(0);

  useEffect(() => {
    const on = (e: Event) => {
      const { id, all } = (e as CustomEvent<{ id: AchievementId; all: boolean }>).detail;
      // Digər səs/bildirişlərlə toqquşmasın deyə bir az sonra
      setTimeout(() => {
        play("powerup");
        toast(aRef.current.unlocked.replace("{name}", aRef.current.names[id]));
        if (all) {
          setTimeout(() => {
            toast(aRef.current.allDone);
            setConfetti((n) => n + 1);
          }, 1800);
        }
      }, 400);
    };
    addEventListener(ACHIEVEMENT_EVENT, on);
    return () => removeEventListener(ACHIEVEMENT_EVENT, on);
  }, []);

  useEffect(() => {
    if (!confetti) return;
    const id = setTimeout(() => setConfetti(0), 4000);
    return () => clearTimeout(id);
  }, [confetti]);

  if (!confetti) return null;
  return createPortal(
    <div className="confetti-rain" aria-hidden key={confetti}>
      {Array.from({ length: 80 }, (_, i) => (
        <motion.span
          key={i}
          style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length], borderRadius: i % 3 ? 2 : "50%" }}
          initial={{ y: -30, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", rotate: (i % 2 ? 1 : -1) * (360 + i * 7), x: ((i * 13) % 80) - 40, opacity: [1, 1, 0.8] }}
          transition={{ duration: 2.2 + (i % 7) * 0.25, delay: (i % 10) * 0.06, ease: "easeIn" }}
        />
      ))}
    </div>,
    document.body,
  );
}

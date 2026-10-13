"use client";

import { useEffect, useRef } from "react";
import { play, setRetroSound } from "@/lib/sound";
import { toast } from "@/lib/toast";
import { unlock } from "@/lib/achievements";
import { useM } from "./LangProvider";

// ↑ ↑ ↓ ↓ ← → ← → B A — saytı retro (8-bit) rejimə keçirir
const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function KonamiRetro() {
  const t = useM().retro;
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      // Yazı sahələrində və Snake oyununda ox düymələri öz işini görür
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, [contenteditable], .snake")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === CODE[pos] ? pos + 1 : key === CODE[0] ? 1 : 0;
      if (pos < CODE.length) return;
      pos = 0;

      const on = document.documentElement.classList.toggle("retro");
      setRetroSound(on);
      play(on ? "powerup" : "powerdown");
      toast(on ? tRef.current.on : tRef.current.off);
      if (on) unlock("retro");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}

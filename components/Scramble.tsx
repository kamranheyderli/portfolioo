"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#01";

// Mətn görünəndə simvollar qarışıb düzgün sözə çevrilir
export default function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const duration = 700;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const settled = Math.floor(p * text.length);
        setOut(
          text
            .split("")
            .map((ch, i) => (i < settled || ch === " " ? ch : CHARS[(Math.random() * CHARS.length) | 0]))
            .join("")
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    // Dil dəyişəndə artıq görünən mətn yenidən qarışır
    if (seen.current) {
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          seen.current = true;
          io.disconnect();
          run();
        }
      },
      { rootMargin: "-60px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    // <span>-da aria-label qadağandır: ekran oxuyucusu üçün gizli real mətn, qarışan simvollar isə gizlədilir
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}

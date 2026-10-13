"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

// Mətn scroll etdikcə söz-söz işıqlanır.
// Hər söz üçün ayrıca React komponenti/animasiya yaratmırıq: tək scroll dinləyicisi
// sözlərin şəffaflığını birbaşa DOM-da dəyişir (açılışda daha az JavaScript işi)
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");

  const paint = useCallback((p: number) => {
    const spans = ref.current?.children;
    if (!spans) return;
    const n = spans.length;
    for (let i = 0; i < n; i++) {
      const t = Math.min(Math.max(p * n - i, 0), 1); // bu sözün öz 0..1 aralığı
      (spans[i] as HTMLElement).style.opacity = String(0.18 + t * 0.82);
    }
  }, []);
  useMotionValueEvent(scrollYProgress, "change", paint);
  // Səhifə ortadan açılanda və ya dil dəyişəndə də cari vəziyyət dərhal tətbiq olunsun
  useEffect(() => paint(scrollYProgress.get()), [text, paint, scrollYProgress]);

  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={`${i}-${w}`} style={{ opacity: 0.18 }}>
          {w}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

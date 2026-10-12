"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/data";

// Konfetti hissəcikləri — bərabər bucaqlarla, təsadüfi olmadan
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const dist = 120 + (i % 4) * 28;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: (i % 2 ? 1 : -1) * (180 + i * 20),
    color: ["var(--c1)", "var(--c2)", "var(--c3)", "#fbbf24"][i % 4],
    shape: i % 3 === 0 ? "50%" : "3px",
    delay: (i % 5) * 0.02,
  };
});

const ease = [0.22, 1, 0.36, 1] as const;

export default function ThankYou({
  name,
  title,
  text,
  again,
  onAgain,
}: {
  name: string;
  title: string;
  text: string;
  again: string;
  onAgain: () => void;
}) {
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstName = name.trim().split(/\s+/)[0] || "";

  // Ekran oxuyucuları və klaviatura üçün fokusu karta keçiririk
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);

  return (
    <motion.div
      className="thanks glass"
      role="status"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="thanks-avatar">
        {!reduce && (
          <div className="thanks-confetti" aria-hidden>
            {CONFETTI.map((c, i) => (
              <motion.span
                key={i}
                style={{ background: c.color, borderRadius: c.shape }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{ x: c.x, y: c.y, scale: [0, 1.2, 1], opacity: [1, 1, 1, 0], rotate: c.rotate }}
                transition={{ duration: 1.6, delay: 0.35 + c.delay, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        <motion.div
          className="thanks-photo"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
        >
          <div className="photo-ring" />
          <Image src={profile.photo} alt={profile.name} width={240} height={240} />
        </motion.div>

        <motion.span
          className="thanks-check"
          aria-hidden
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.55 }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.75, ease: "easeOut" }}
            />
          </svg>
        </motion.span>
      </div>

      <motion.h3
        ref={headingRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease }}
      >
        {title.replace("{name}", firstName).replace(/,\s*!/, "!")}{" "}
        <motion.span
          className="thanks-wave"
          aria-hidden
          animate={reduce ? undefined : { rotate: [0, 18, -8, 18, -4, 12, 0] }}
          transition={{ duration: 1.6, delay: 0.9, ease: "easeInOut" }}
        >
          👋
        </motion.span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease }}
      >
        {text}
      </motion.p>

      <motion.button
        type="button"
        className="btn btn-ghost thanks-again"
        onClick={onAgain}
        data-hover
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        ← {again}
      </motion.button>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "アカサタナハマヤラワ0123456789ABCDEFKAMRAN<>/{}=;";
const FONT = 15;

// Terminalda "Matrix" kod yağışı — istənilən düymə və ya toxunuş çıxarır
export default function Matrix({ onExit }: { onExit: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    wrapRef.current?.focus();
    const canvas = canvasRef.current!;
    const c = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let drops: number[] = [];
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.parentElement!.clientWidth;
      h = canvas.parentElement!.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = "#0d0c18";
      c.fillRect(0, 0, w, h);
      drops = Array.from({ length: Math.ceil(w / FONT) }, () => Math.floor(Math.random() * -h / FONT));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const frame = () => {
      // Yarımşəffaf örtük köhnə simvolları tədricən söndürür
      c.fillStyle = "rgba(13, 12, 24, 0.08)";
      c.fillRect(0, 0, w, h);
      c.font = `${FONT}px ui-monospace, Menlo, monospace`;
      drops.forEach((y, i) => {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * FONT;
        c.fillStyle = "#d9fff0";
        c.fillText(ch, x, y * FONT);
        c.fillStyle = "#00ffa3";
        c.fillText(GLYPHS[(i + y) % GLYPHS.length], x, (y - 1) * FONT);
        drops[i] = y * FONT > h && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    const id = setInterval(frame, reduce ? 200 : 45);
    return () => {
      clearInterval(id);
      ro.disconnect();
    };
  }, [reduce]);

  return (
    <div
      ref={wrapRef}
      className="matrix"
      tabIndex={0}
      role="img"
      aria-label="Matrix digital rain. Press any key to exit."
      onKeyDown={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        e.stopPropagation();
        onExit();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onExit();
      }}
    >
      <canvas ref={canvasRef} />
      <span className="matrix-hint">wake up, visitor… press any key</span>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/lib/toast";
import { useM } from "./LangProvider";

type Season = "novruz" | "winter";
const GREETED_KEY = "season-greeted";

// Bakı vaxtına görə bayram dövrü. ?season=novruz | winter | off ilə istənilən vaxt yoxlamaq olar
function currentSeason(): Season | null {
  const q = new URLSearchParams(location.search).get("season");
  if (q === "novruz" || q === "winter") return q;
  if (q === "off") return null;
  const [m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baku", month: "numeric", day: "numeric" })
    .formatToParts(new Date())
    .filter((p) => p.type === "month" || p.type === "day")
    .map((p) => Number(p.value));
  if (m === 3 && d >= 18 && d <= 24) return "novruz";
  if ((m === 12 && d >= 20) || (m === 1 && d <= 7)) return "winter";
  return null;
}

type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; seed: number };

export default function SeasonalFx() {
  const m = useM().season;
  const [season, setSeason] = useState<Season | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const greetRef = useRef(m);
  greetRef.current = m;

  useEffect(() => {
    const s = currentSeason();
    setSeason(s);
    if (!s) return;
    try {
      if (sessionStorage.getItem(GREETED_KEY) === s) return;
      sessionStorage.setItem(GREETED_KEY, s);
    } catch {}
    // Preloader bitəndən sonra təbrik
    const id = setTimeout(() => toast(greetRef.current[s]), 2600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!season || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current!;
    const c = canvas.getContext("2d")!;
    const mobile = innerWidth < 768;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, last = performance.now();

    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const count = season === "winter" ? (mobile ? 45 : 90) : mobile ? 35 : 70;
    const spawn = (initial: boolean): P =>
      season === "winter"
        ? { x: Math.random() * w, y: initial ? Math.random() * h : -10, vx: (Math.random() - 0.5) * 20, vy: 25 + Math.random() * 45, r: 1 + Math.random() * 2.6, life: 1, seed: Math.random() * 100 }
        : { x: w * (0.15 + Math.random() * 0.7), y: initial ? h - Math.random() * h * 0.6 : h + 10, vx: (Math.random() - 0.5) * 30, vy: -(40 + Math.random() * 80), r: 0.8 + Math.random() * 2.2, life: initial ? Math.random() : 1, seed: Math.random() * 100 };
    const parts = Array.from({ length: count }, () => spawn(true));

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      c.clearRect(0, 0, w, h);

      if (season === "novruz") {
        // Ekranın aşağısında tonqal işığı
        const g = c.createRadialGradient(w / 2, h + 60, 0, w / 2, h + 60, Math.max(w, h) * 0.55);
        const flicker = 0.16 + Math.sin(t / 140) * 0.02 + Math.sin(t / 53) * 0.015;
        g.addColorStop(0, `rgba(255, 120, 30, ${flicker})`);
        g.addColorStop(1, "rgba(255, 80, 0, 0)");
        c.fillStyle = g;
        // Bütün ekrana çəkilir — qradient özü sönür, yuxarıda kəskin sərhəd qalmır
        c.fillRect(0, 0, w, h);
      }

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (season === "winter") {
          p.x += (p.vx + Math.sin(t / 900 + p.seed) * 18) * dt;
          p.y += p.vy * dt;
          if (p.y > h + 10) parts[i] = spawn(false);
          c.fillStyle = `rgba(255, 255, 255, ${0.35 + p.r * 0.15})`;
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fill();
        } else {
          p.x += (p.vx + Math.sin(t / 300 + p.seed) * 25) * dt;
          p.y += p.vy * dt;
          p.life -= dt * 0.22;
          if (p.life <= 0 || p.y < -10) parts[i] = spawn(false);
          const a = Math.max(0, p.life);
          c.fillStyle = `rgba(255, ${140 + Math.round(p.life * 90)}, 60, ${a})`;
          c.shadowColor = "rgba(255, 140, 40, 0.9)";
          c.shadowBlur = 8;
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fill();
          c.shadowBlur = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, [season]);

  if (!season) return null;
  return <canvas ref={canvasRef} className="season-fx" aria-hidden />;
}

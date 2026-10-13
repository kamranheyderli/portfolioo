"use client";

import { Fragment, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { profile } from "@/lib/data";
import { useT } from "@/components/LangProvider";
import { useIntro } from "@/components/Preloader";
import Magnetic from "@/components/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const letter: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { delay: 0.15 + i * 0.03, duration: 0.9, ease },
  }),
};


export default function Hero() {
  const t = useT();
  const { done } = useIntro();
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: done ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { delay: delay * 0.45, duration: 0.7, ease },
  });
  // Tagline səhifənin ən böyük mətnidir (LCP): opacity 0-dan başlasa Google onu yalnız animasiyadan sonra "görür".
  // Ona görə yalnız hərəkətlə görünür — preloader-in arxasında dərhal çəkilir
  const slideUp = (delay: number) => ({
    initial: { y: 16 },
    animate: done ? { y: 0 } : { y: 16 },
    transition: { delay: delay * 0.45, duration: 0.7, ease },
  });
  const words = profile.name.split(" ");
  let idx = 0;

  // Kursor yaxınlaşanda hərflər yaylı şəkildə kənara itələnir (yalnız siçanla, animasiyalar azaldılmayıbsa)
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const letters = Array.from(titleRef.current?.querySelectorAll<HTMLElement>(".mask") ?? []);
    const state = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let mx = -9999, my = -9999, raf = 0;
    const RADIUS = 140, PUSH = 26;

    const tick = () => {
      let moving = false;
      // Əvvəl bütün ölçüləri oxuyuruq, sonra yazırıq — hər hərfdə ayrıca layout hesablanmasın
      const rects = letters.map((el) => el.getBoundingClientRect());
      letters.forEach((el, i) => {
        const r = rects[i];
        const cx = r.left + r.width / 2 - state[i].x, cy = r.top + r.height / 2 - state[i].y;
        const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy);
        const f = d < RADIUS ? (1 - d / RADIUS) ** 2 * PUSH : 0;
        const tx = d ? (dx / d) * f : 0, ty = d ? (dy / d) * f : 0;
        const s = state[i];
        // Yay (spring): hədəfə doğru çəkilir, sürtünmə ilə sakitləşir
        s.vx = (s.vx + (tx - s.x) * 0.18) * 0.72;
        s.vy = (s.vy + (ty - s.y) * 0.18) * 0.72;
        s.x += s.vx;
        s.y += s.vy;
        if (Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(tx - s.x) + Math.abs(ty - s.y) > 0.05) moving = true;
        el.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px)`;
      });
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // Kursor pəncərədən çıxanda hərflər yerinə qayıdır
    const leave = () => { mx = my = -9999; if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero-content">
        <motion.p className="eyebrow" {...fadeUp(0.1)}>
          <span className="pulse" /> {t.hero.available}
        </motion.p>

        <h1 className="hero-title" ref={titleRef}>
          {words.map((w, wi) => (
            <Fragment key={w}>
              {/* Sözlər arasında real boşluq: Google və ekran oxuyucuları adı "KamranHeyderli" yox, "Kamran Heyderli" oxusun */}
              {wi > 0 && " "}
            <span className="word">
              {w.split("").map((ch) => (
                <span key={idx} className="mask">
                  <motion.span custom={idx++} variants={letter} initial="hidden" animate={done ? "show" : "hidden"}>
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
            </Fragment>
          ))}
        </h1>

        <motion.p className="role gradient-text" {...fadeUp(1.0)}>
          {profile.role}
        </motion.p>
        <motion.p className="hero-tagline" {...slideUp(1.15)}>
          {t.hero.tagline}
        </motion.p>

        <motion.div className="hero-actions" {...fadeUp(1.3)}>
          <Magnetic>
            <a href="#contact" className="btn btn-primary" data-hover>
              {t.hero.ctaPrimary} <span>→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="/Kamran_Heyderli_CV.pdf" download className="btn btn-ghost" data-hover>
              {t.hero.cv}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.a href="#about" className="scroll-hint" {...fadeUp(1.8)} data-hover>
        <span className="line" />
        <span>{t.hero.scroll}</span>
      </motion.a>
    </section>
  );
}

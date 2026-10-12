"use client";

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
    transition: { delay: delay * 0.7, duration: 0.8, ease },
  });
  const words = profile.name.split(" ");
  let idx = 0;

  return (
    <section id="top" className="hero">
      <div className="hero-content">
        <motion.p className="eyebrow" {...fadeUp(0.1)}>
          <span className="pulse" /> {t.hero.available}
        </motion.p>

        <h1 className="hero-title">
          {words.map((w) => (
            <span key={w} className="word">
              {w.split("").map((ch) => (
                <span key={idx} className="mask">
                  <motion.span custom={idx++} variants={letter} initial="hidden" animate={done ? "show" : "hidden"}>
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p className="role gradient-text" {...fadeUp(1.0)}>
          {profile.role}
        </motion.p>
        <motion.p className="hero-tagline" {...fadeUp(1.15)}>
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

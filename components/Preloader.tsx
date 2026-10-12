"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, animate } from "framer-motion";
import { profile } from "@/lib/data";
import { INTRO_KEY as SESSION_KEY } from "@/lib/initScripts";

const IntroContext = createContext({ done: false });
export const useIntro = () => useContext(IntroContext);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const finish = () => {
      setActive(false);
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    };
    if (document.documentElement.classList.contains("intro-skip")) return finish();

    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(finish, 250),
    });
    return () => controls.stop();
  }, []);

  return (
    <IntroContext.Provider value={{ done: !active }}>
      <AnimatePresence>
        {active && (
          <motion.div
            className="preloader"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader-name">
              {profile.name}
              <span>{profile.role}</span>
            </div>
            <div className="preloader-count">
              {String(count).padStart(3, "0")}
              <small>%</small>
            </div>
            <div className="preloader-bar">
              <span style={{ transform: `scaleX(${count / 100})` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}

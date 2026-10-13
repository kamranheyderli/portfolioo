"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, animate } from "framer-motion";
import { profile } from "@/lib/data";
import { INTRO_KEY as SESSION_KEY } from "@/lib/initScripts";

const IntroContext = createContext({ done: false });
export const useIntro = () => useContext(IntroContext);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(true);
  // Faiz və zolaq birbaşa DOM-a yazılır: hər kadrda bütün tətbiqi yenidən render etməyə ehtiyac yoxdur
  const countRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

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
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.firstChild!.textContent = String(Math.round(v)).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => setTimeout(finish, 150),
    });
    return () => controls.stop();
  }, []);

  const value = useMemo(() => ({ done: !active }), [active]);

  return (
    <IntroContext.Provider value={value}>
      <AnimatePresence>
        {active && (
          <motion.div
            className="preloader"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader-name">
              {profile.name}
              <span>{profile.role}</span>
            </div>
            <div className="preloader-count" ref={countRef}>
              {"000"}
              <small>%</small>
            </div>
            <div className="preloader-bar">
              <span ref={barRef} style={{ transform: "scaleX(0)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}

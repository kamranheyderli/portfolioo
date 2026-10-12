"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/lib/toast";
import { useM } from "./LangProvider";

const VISITED_KEY = "visited";
const WELCOMED_KEY = "welcomed";
const AWAY_MIN_MS = 5000;

// Tab-dan çıxanda başlıq dəyişir, qayıdanda və saytı təkrar açanda salam verilir
export default function TabPresence() {
  const t = useM().tab;
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    let savedTitle = document.title;
    let leftAt = 0;

    const onVisibility = () => {
      if (document.hidden) {
        savedTitle = document.title;
        leftAt = Date.now();
        document.title = tRef.current.away;
      } else {
        document.title = savedTitle;
        if (leftAt && Date.now() - leftAt > AWAY_MIN_MS) toast(tRef.current.welcomeBack);
        leftAt = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Əvvəllər gəlmiş ziyarətçini hər sessiyada bir dəfə salamlayırıq (preloader bitəndən sonra)
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const returning = localStorage.getItem(VISITED_KEY);
      localStorage.setItem(VISITED_KEY, "1");
      if (returning && !sessionStorage.getItem(WELCOMED_KEY)) {
        sessionStorage.setItem(WELCOMED_KEY, "1");
        timer = setTimeout(() => toast(tRef.current.welcomeBack), 3200);
      }
    } catch {}

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(timer);
      document.title = savedTitle;
    };
  }, []);

  return null;
}

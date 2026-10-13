"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_TERMINAL_EVENT } from "@/lib/events";

// Terminal və onun əmrləri ~30 KB JavaScript-dir, ziyarətçilərin çoxu isə onu heç açmır.
// Burada yalnız ⌘K / düyməni gözləyirik; panel ilk açılışda yüklənir və sonra özü idarə edir.
const TerminalPanel = dynamic(() => import("./TerminalPanel"), { ssr: false });

export default function Terminal() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const load = () => setLoaded(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        load();
      }
    };
    addEventListener("keydown", onKey);
    addEventListener(OPEN_TERMINAL_EVENT, load);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener(OPEN_TERMINAL_EVENT, load);
    };
  }, [loaded]);

  return loaded ? <TerminalPanel initialOpen /> : null;
}

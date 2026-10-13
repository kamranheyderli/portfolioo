"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_SHORTCUTS_EVENT } from "@/lib/events";

// "?" pəncərəsi (qısayollar, rəng, musiqi, nailiyyətlər) ilk dəfə açılanda yüklənir
const ShortcutsPanel = dynamic(() => import("./ShortcutsPanel"), { ssr: false });

export default function ShortcutsHelp() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const load = () => setLoaded(true);
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, [contenteditable], .snake, .term")) return;
      if (e.key === "?") {
        e.preventDefault();
        load();
      }
    };
    addEventListener("keydown", onKey);
    addEventListener(OPEN_SHORTCUTS_EVENT, load);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener(OPEN_SHORTCUTS_EVENT, load);
    };
  }, [loaded]);

  return loaded ? <ShortcutsPanel initialOpen /> : null;
}

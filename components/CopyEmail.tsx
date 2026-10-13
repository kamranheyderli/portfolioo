"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { play } from "@/lib/sound";
import { toast } from "@/lib/toast";
import { useM } from "./LangProvider";

// E-poçtu bir kliklə buferə kopyalayır
export default function CopyEmail() {
  const c = useM().copy;
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Köhnə brauzerlər üçün ehtiyat yol
      const ta = Object.assign(document.createElement("textarea"), { value: profile.email });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    play("success");
    toast(c.done);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };

  return (
    <button type="button" className="copy-email glass" onClick={copy} aria-label={c.label} title={c.label} data-hover data-sound="none">
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={done ? "ok" : "copy"}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}
          aria-hidden
        >
          {done ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}

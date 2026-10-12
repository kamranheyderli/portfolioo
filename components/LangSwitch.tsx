"use client";

import { motion } from "framer-motion";
import { languages } from "@/lib/i18n";
import { useLang } from "./LangProvider";

export default function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-switch glass" role="group" aria-label="Language">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={lang === l.code ? "active" : ""}
          aria-pressed={lang === l.code}
          data-hover
        >
          {lang === l.code && (
            <motion.span layoutId="lang-pill" className="lang-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
          )}
          <span className="lang-label">{l.label}</span>
        </button>
      ))}
    </div>
  );
}

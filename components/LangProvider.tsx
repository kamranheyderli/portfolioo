"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, languages, type Lang } from "@/lib/i18n";
import { extra } from "@/lib/i18n-extra";
import { more } from "@/lib/i18n-more";

const STORAGE_KEY = "lang";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "az",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("az");

  // Əvvəl seçilmiş dili bərpa et
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (languages.some((l) => l.code === saved)) setLangState(saved as Lang);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  return dict[useLang().lang];
}

export function useX() {
  return extra[useLang().lang];
}

export function useM() {
  return more[useLang().lang];
}

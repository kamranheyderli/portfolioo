"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { companies, profile, skillGroups } from "@/lib/data";
import { languages, type Lang } from "@/lib/i18n";
import { getLenis, scrollToId } from "@/lib/scroller";
import { play } from "@/lib/sound";
import { useLang, useT } from "./LangProvider";
import { useTheme } from "./ThemeProvider";
import Snake from "./Snake";

type Line = { kind: "in" | "out" | "err" | "accent"; text: string };

const COMMANDS: Record<string, string> = {
  help: "show available commands",
  whoami: "who am I?",
  about: "go to About section",
  experience: "work history",
  skills: "tech stack",
  contact: "contact info",
  cv: "download my CV",
  github: "open GitHub",
  linkedin: "open LinkedIn",
  theme: "theme [light|dark] — switch theme",
  lang: "lang [az|en|ru] — switch language",
  ls: "list sections",
  date: "current date",
  snake: "play Snake 🐍",
  clear: "clear the terminal",
  exit: "close the terminal",
};

const SUGGESTIONS = ["help", "whoami", "snake", "skills", "experience", "theme", "lang en", "cv"];

const WELCOME: Line[] = [
  { kind: "accent", text: `Welcome to ${profile.name}'s portfolio terminal ✦` },
  { kind: "out", text: "Type 'help' to see available commands." },
];

// Terminalı açmaq üçün qlobal hadisə (nav düyməsi istifadə edir)
export const openTerminal = () => window.dispatchEvent(new Event("open-terminal"));

export default function Terminal() {
  const t = useT();
  const { setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpen);
    };
  }, []);

  // Açıq olanda arxa fon scroll olmasın
  useEffect(() => {
    const lenis = getLenis();
    // İlk yüklənmədə deyil, yalnız açılıb-bağlananda səslənir
    if (open !== wasOpen.current) play(open ? "open" : "close");
    wasOpen.current = open;
    if (!open) setPlaying(false);
    if (open) {
      lenis?.stop();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else lenis?.start();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const goTo = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 350);
  };

  const run = (raw: string): Line[] => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args[0]?.toLowerCase();
    switch (cmd?.toLowerCase()) {
      case "":
        return [];
      case "help":
        return Object.entries(COMMANDS).map(([k, v]) => ({ kind: "out", text: `${k.padEnd(12)} ${v}` }));
      case "whoami":
        return [
          { kind: "accent", text: `${profile.name} — ${profile.role}` },
          { kind: "out", text: t.hero.tagline },
          { kind: "out", text: t.contact.location },
        ];
      case "about":
        goTo("about");
        return [{ kind: "out", text: t.about.text }];
      case "experience":
      case "exp":
        return companies.flatMap((c, i) => [
          { kind: "accent" as const, text: `${c.company} — ${c.role} (${t.experience.jobs[i].period})` },
          ...t.experience.jobs[i].points.map((p) => ({ kind: "out" as const, text: `  • ${p}` })),
        ]);
      case "skills":
        return skillGroups.map((g) => ({ kind: "out", text: `${t.skills.groups[g.key].padEnd(14)} ${g.items.join(", ")}` }));
      case "contact":
        return [
          { kind: "out", text: `email     ${profile.email}` },
          { kind: "out", text: `phone     ${profile.phone}` },
          ...profile.socials.filter((s) => !s.href.startsWith("mailto")).map((s) => ({ kind: "out" as const, text: `${s.label.toLowerCase().padEnd(9)} ${s.href}` })),
        ];
      case "cv": {
        const a = document.createElement("a");
        a.href = "/Kamran_Heyderli_CV.pdf";
        a.download = "";
        a.click();
        return [{ kind: "accent", text: "Downloading Kamran_Heyderli_CV.pdf ..." }];
      }
      case "github":
      case "linkedin": {
        const s = profile.socials.find((x) => x.label.toLowerCase() === cmd.toLowerCase())!;
        window.open(s.href, "_blank", "noopener");
        return [{ kind: "out", text: `Opening ${s.href}` }];
      }
      case "theme":
        if (arg && arg !== "light" && arg !== "dark") return [{ kind: "err", text: "usage: theme [light|dark]" }];
        if (!arg || arg !== theme) toggle();
        return [{ kind: "out", text: `Theme → ${arg ?? (theme === "dark" ? "light" : "dark")}` }];
      case "lang":
        if (!languages.some((l) => l.code === arg)) return [{ kind: "err", text: "usage: lang [az|en|ru]" }];
        setLang(arg as Lang);
        return [{ kind: "out", text: `Language → ${arg}` }];
      case "ls":
        return [{ kind: "out", text: "about/  experience/  skills/  contact/" }];
      case "cd": {
        const id = arg?.replace(/\/$/, "");
        if (id && ["about", "experience", "skills", "contact"].includes(id)) {
          goTo(id);
          return [];
        }
        return [{ kind: "err", text: `cd: no such section: ${arg ?? ""}` }];
      }
      case "date":
        return [{ kind: "out", text: new Date().toString() }];
      case "snake":
        setPlaying(true);
        return [{ kind: "accent", text: "🐍 Starting snake… arrows / WASD to move, space to pause, q to quit" }];
      case "sudo":
        return [{ kind: "err", text: "Permission denied. Nice try 😄" }];
      case "exit":
        setOpen(false);
        return [];
      default:
        return [{ kind: "err", text: `command not found: ${cmd}. Type 'help'.` }];
    }
  };

  const submit = (cmd: string) => {
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
      play("enter");
    } else {
      const out = run(cmd);
      play(out.some((l) => l.kind === "err") ? "error" : "enter");
      setLines((l) => [...l, { kind: "in", text: cmd }, ...out]);
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
    setHIndex(-1);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) play("key");
    else if (e.key === "Backspace" && value) play("key");

    if (e.key === "Enter") submit(value);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIndex + 1, history.length - 1);
      if (history[i] !== undefined) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(Math.max(i, -1));
      setValue(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(value.toLowerCase()) && value);
      if (match) {
        setValue(match);
        play("key");
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="term-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="term"
            role="dialog"
            aria-label="Terminal"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => {
              e.stopPropagation();
              (playing ? e.currentTarget.querySelector<HTMLElement>(".snake") : inputRef.current)?.focus();
            }}
          >
            <div className="term-bar">
              <button className="dot red" onClick={() => setOpen(false)} aria-label="Close" data-sound="none" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="term-title">kamran@portfolio: ~</span>
              <kbd>esc</kbd>
            </div>
            {playing ? (
              <Snake
                onExit={(score, best) => {
                  setPlaying(false);
                  setLines((l) => [...l, { kind: "accent", text: `🐍 Game over — score ${score} · best ${best}` }]);
                  setTimeout(() => inputRef.current?.focus(), 30);
                }}
              />
            ) : (
            <div className="term-body" ref={bodyRef} data-lenis-prevent>
              {lines.map((l, i) => (
                <div key={i} className={`term-line ${l.kind}`}>
                  {l.kind === "in" && <span className="prompt">➜ ~</span>}
                  {l.text}
                </div>
              ))}
              <div className="term-line in">
                <span className="prompt">➜ ~</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Command"
                />
              </div>
            </div>
            )}
            <div className="term-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => submit(s)} data-hover data-sound="none">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

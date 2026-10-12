"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { companies, profile, skillGroups } from "@/lib/data";
import { languages, type Lang } from "@/lib/i18n";
import { getLenis, scrollToId } from "@/lib/scroller";
import { play } from "@/lib/sound";
import { FORMSPREE_ENDPOINT } from "@/lib/site";
import { useLang, useT } from "./LangProvider";
import { useTheme } from "./ThemeProvider";
import Snake from "./Snake";
import Matrix from "./Matrix";
import TypingTest from "./TypingTest";

// "art" — neofetch-dəki ASCII loqo sütunu
type Line = { kind: "in" | "out" | "err" | "accent"; text: string; art?: string; prompt?: string };
type App = "snake" | "matrix" | "typing";

// "hire-me" — terminalda addım-addım sorğu, cavablar Formspree ilə e-poçta gedir
const HIRE_STEPS = [
  { key: "name", q: "What's your name?" },
  { key: "email", q: "Your email — so I can reply?" },
  { key: "project", q: "What are we building? (one line is fine)" },
  { key: "budget", q: "Budget range? (Enter to skip)", optional: true },
  { key: "timeline", q: "Timeline? (Enter to skip)", optional: true },
] as const;
type Wizard = { step: number; answers: Record<string, string>; confirming: boolean; sending: boolean };

const KH_ART = [
  "██╗  ██╗██╗  ██╗",
  "██║ ██╔╝██║  ██║",
  "█████╔╝ ███████║",
  "██╔═██╗ ██╔══██║",
  "██║  ██╗██║  ██║",
  "╚═╝  ╚═╝╚═╝  ╚═╝",
];

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
  typing: "typing speed test ⌨️",
  matrix: "follow the white rabbit 🐇",
  "hire-me": "send me a project request, right here",
  neofetch: "system info, but it's me",
  resume: "open the printable CV page",
  clear: "clear the terminal",
  exit: "close the terminal",
};

const SUGGESTIONS = ["help", "hire-me", "snake", "typing", "matrix", "neofetch", "whoami", "skills", "theme", "lang en", "cv"];

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
  const [app, setApp] = useState<App | null>(null);
  const [wizard, setWizard] = useState<Wizard | null>(null);
  const router = useRouter();
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
    if (!open) {
      setApp(null);
      setWizard(null);
    }
    if (open) {
      lenis?.stop();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else lenis?.start();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, app]);

  // Oyundan / effektdən çıxanda əmr sətrinə qayıdırıq
  const closeApp = (line?: Line) => {
    setApp(null);
    if (line) setLines((l) => [...l, line]);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const neofetch = (): Line[] => {
    const info = [
      `kamran@portfolio`,
      `----------------`,
      `OS        ${profile.role}`,
      `Host      ${t.contact.location}`,
      `Uptime    ${t.about.stats[0].value} ${t.about.stats[0].label}`,
      `Shell     React · Next.js · TypeScript`,
      `Packages  ${skillGroups.reduce((n, g) => n + g.items.length, 0)} skills`,
      `History   ${companies.map((c) => c.company).join(" → ")}`,
      `Status    open to work ✓`,
    ];
    return info.map((text, i) => ({ kind: i === 0 ? "accent" : "out", text, art: (KH_ART[i] ?? "").padEnd(18) }));
  };

  const sendHire = async (answers: Record<string, string>) => {
    const data = new FormData();
    data.set("name", answers.name);
    data.set("email", answers.email);
    data.set("message", [
      `Project: ${answers.project}`,
      `Budget: ${answers.budget || "—"}`,
      `Timeline: ${answers.timeline || "—"}`,
      "",
      "(sent from the portfolio terminal: hire-me)",
    ].join("\n"));
    data.set("_subject", `Hire-me (terminal): ${answers.name}`);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!res.ok) throw new Error(String(res.status));
      play("success");
      setLines((l) => [
        ...l,
        { kind: "accent", text: `✓ Sent! Thanks, ${answers.name.split(" ")[0]} — I'll reply to ${answers.email} soon. 🚀` },
      ]);
    } catch {
      play("error");
      setLines((l) => [...l, { kind: "err", text: `✗ Couldn't send. Please email me directly: ${profile.email}` }]);
    }
    setWizard(null);
  };

  // Sorğu rejimində yazılan hər sətir növbəti suala cavabdır
  const answerWizard = (raw: string) => {
    const w = wizard!;
    const v = raw.trim();
    const echo: Line = { kind: "in", text: raw, prompt: "?" };
    if (v.toLowerCase() === "cancel") {
      play("close");
      setWizard(null);
      setLines((l) => [...l, echo, { kind: "out", text: "Cancelled. No worries 👋" }]);
      return;
    }
    if (w.confirming) {
      if (/^(y|yes|h|hə|he|д|да)$/i.test(v)) {
        play("enter");
        setWizard({ ...w, sending: true });
        setLines((l) => [...l, echo, { kind: "out", text: "Sending…" }]);
        void sendHire(w.answers);
      } else {
        play("close");
        setWizard(null);
        setLines((l) => [...l, echo, { kind: "out", text: "Not sent. Type 'hire-me' to start over." }]);
      }
      return;
    }
    const step = HIRE_STEPS[w.step];
    if (!v && !("optional" in step)) {
      play("error");
      setLines((l) => [...l, echo, { kind: "err", text: "This one is required 🙂" }]);
      return;
    }
    if (step.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      play("error");
      setLines((l) => [...l, echo, { kind: "err", text: "Hmm, that doesn't look like an email. Try again?" }]);
      return;
    }
    play("enter");
    const answers = { ...w.answers, [step.key]: v };
    const nextStep = w.step + 1;
    if (nextStep < HIRE_STEPS.length) {
      setWizard({ ...w, step: nextStep, answers });
      setLines((l) => [...l, echo, { kind: "accent", text: HIRE_STEPS[nextStep].q }]);
    } else {
      setWizard({ ...w, answers, confirming: true });
      setLines((l) => [
        ...l,
        echo,
        { kind: "out", text: "──────── summary ────────" },
        ...HIRE_STEPS.map((s) => ({ kind: "out" as const, text: `${s.key.padEnd(9)} ${answers[s.key] || "—"}` })),
        { kind: "accent", text: "Send this to Kamran? (y/n)" },
      ]);
    }
  };

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
        setApp("snake");
        return [{ kind: "accent", text: "🐍 Starting snake… arrows / WASD to move, space to pause, q to quit" }];
      case "typing":
        setApp("typing");
        return [{ kind: "accent", text: "⌨️ Typing test — type the sentence as fast as you can" }];
      case "matrix":
        setApp("matrix");
        return [];
      case "neofetch":
        return neofetch();
      case "resume":
        setOpen(false);
        router.push("/cv");
        return [];
      case "hire-me":
      case "hire":
        setWizard({ step: 0, answers: {}, confirming: false, sending: false });
        return [
          { kind: "accent", text: "Let's talk about your project 🤝  (type 'cancel' anytime)" },
          { kind: "accent", text: HIRE_STEPS[0].q },
        ];
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
    if (wizard) {
      if (!wizard.sending) answerWizard(cmd);
      setValue("");
      return;
    }
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
    else if (wizard) return;
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
              if (!app) inputRef.current?.focus();
            }}
          >
            <div className="term-bar">
              <button className="dot red" onClick={() => setOpen(false)} aria-label="Close" data-sound="none" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="term-title">kamran@portfolio: ~</span>
              <kbd>esc</kbd>
            </div>
            {app === "snake" ? (
              <Snake onExit={(score, best) => closeApp({ kind: "accent", text: `🐍 Game over — score ${score} · best ${best}` })} />
            ) : app === "typing" ? (
              <TypingTest
                onExit={(wpm, acc, best) =>
                  closeApp({ kind: "accent", text: wpm ? `⌨️ ${wpm} wpm · ${acc}% accuracy · best ${best} wpm` : `⌨️ Typing test closed · best ${best} wpm` })
                }
              />
            ) : app === "matrix" ? (
              <Matrix onExit={() => closeApp({ kind: "accent", text: "🐇 You took the red pill." })} />
            ) : (
            <div className="term-body" ref={bodyRef} data-lenis-prevent>
              {lines.map((l, i) => (
                <div key={i} className={`term-line ${l.kind}`}>
                  {l.kind === "in" && <span className="prompt">{l.prompt ?? "➜ ~"}</span>}
                  {l.art !== undefined && <span className="fetch-art" aria-hidden>{l.art}</span>}
                  {l.text}
                </div>
              ))}
              <div className="term-line in">
                <span className="prompt">{wizard ? "?" : "➜ ~"}</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label={wizard ? "Answer" : "Command"}
                  disabled={wizard?.sending}
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

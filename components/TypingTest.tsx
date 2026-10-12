"use client";

import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";

// Terminalda yazı sürəti testi — WPM və dəqiqlik ölçülür
const TEXTS = [
  "the best code is the code you never have to write twice",
  "make it work then make it right then make it fast",
  "a component should do one thing and do it well",
  "good interfaces feel invisible until something goes wrong",
  "ship small changes often and measure what users actually do",
  "performance is a feature and accessibility is not optional",
  "naming things is hard so name them for the next reader",
];
const BEST_KEY = "typing-best";

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

export default function TypingTest({ onExit }: { onExit: (wpm: number, acc: number, best: number) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [round, setRound] = useState(0);
  const [text, setText] = useState(TEXTS[0]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<{ wpm: number; acc: number } | null>(null);
  const [best, setBest] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setBest(readBest());
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    inputRef.current?.focus();
  }, []);

  // Canlı WPM üçün saniyəlik yenilənmə
  useEffect(() => {
    if (!startedAt || result) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, result]);

  const restart = () => {
    const next = TEXTS[(TEXTS.indexOf(text) + 1 + Math.floor(Math.random() * (TEXTS.length - 1))) % TEXTS.length];
    setText(next);
    setTyped("");
    setStartedAt(null);
    setMistakes(0);
    setResult(null);
    setRound((r) => r + 1);
    play("enter");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finish = (start: number, errors: number) => {
    const minutes = (Date.now() - start) / 60000;
    const wpm = Math.round(text.length / 5 / Math.max(minutes, 1 / 600));
    const acc = Math.max(0, Math.round(((text.length - errors) / text.length) * 100));
    setResult({ wpm, acc });
    if (wpm > best) {
      setBest(wpm);
      try {
        localStorage.setItem(BEST_KEY, String(wpm));
      } catch {}
    }
    play("success");
  };

  const onChange = (value: string) => {
    if (result) return;
    // Yalnız irəli yazmaq və silmək — mətnin sonundan kənara çıxmaq olmaz
    const v = value.slice(0, text.length);
    const start = startedAt ?? Date.now();
    if (!startedAt) setStartedAt(start);
    let errors = mistakes;
    if (v.length > typed.length) {
      const i = v.length - 1;
      if (v[i] !== text[i]) {
        errors += 1;
        setMistakes(errors);
        play("error");
      } else play("key");
    } else play("key");
    setTyped(v);
    if (v === text) finish(start, errors);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onExit(result?.wpm ?? 0, result?.acc ?? 0, Math.max(best, result?.wpm ?? 0));
    } else if (e.key === "Enter" || (e.key === "Tab" && result)) {
      e.preventDefault();
      if (result) restart();
    }
  };

  const liveWpm = startedAt && !result && now > startedAt
    ? Math.round(typed.length / 5 / ((now - startedAt) / 60000))
    : result?.wpm ?? 0;

  return (
    <div className="typing" onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}>
      <div className="snake-hud">
        <span>⌨️ typing test</span>
        <span>wpm <b>{liveWpm}</b></span>
        <span>best <b>{Math.max(best, result?.wpm ?? 0)}</b></span>
        <button type="button" onClick={() => onExit(result?.wpm ?? 0, result?.acc ?? 0, Math.max(best, result?.wpm ?? 0))} data-hover>
          quit (esc)
        </button>
      </div>

      <p className="typing-text" key={round} aria-hidden>
        {text.split("").map((ch, i) => {
          const state = i < typed.length ? (typed[i] === ch ? "ok" : "bad") : i === typed.length ? "cur" : "";
          return <span key={i} className={state}>{ch}</span>;
        })}
      </p>
      <input
        ref={inputRef}
        className="typing-input"
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label={`Type this text: ${text}`}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <p className="typing-foot" aria-live="polite">
        {result
          ? <>✓ <b>{result.wpm} wpm</b> · accuracy <b>{result.acc}%</b>{result.wpm >= best && result.wpm > 0 ? " · new best! 🏆" : ""} — Enter to retry, Esc to quit</>
          : startedAt ? `mistakes: ${mistakes}` : "start typing — the timer begins with your first key"}
      </p>
    </div>
  );
}

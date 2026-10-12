"use client";

import { useEffect, useState } from "react";
import { openTerminal } from "./Terminal";

export default function TerminalButton() {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <button className="term-btn glass" onClick={openTerminal} aria-label="Open terminal" title="Terminal" data-hover>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 17l6-5-6-5M12 19h8" />
      </svg>
      <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}

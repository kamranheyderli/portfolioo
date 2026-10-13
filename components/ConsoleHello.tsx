"use client";

import { useEffect } from "react";
import { profile } from "@/lib/data";

let shown = false;

// DevTools-u açan developerlər üçün kiçik salam
export default function ConsoleHello() {
  useEffect(() => {
    if (shown) return;
    shown = true;
    const art = [
      "██╗  ██╗██╗  ██╗",
      "██║ ██╔╝██║  ██║",
      "█████╔╝ ███████║",
      "██╔═██╗ ██╔══██║",
      "██║  ██╗██║  ██║",
      "╚═╝  ╚═╝╚═╝  ╚═╝",
    ].join("\n");
    console.log(`%c${art}`, "color:#7c5cff;font-family:monospace;line-height:1.1");
    console.log(
      "%cHey developer 👋%c\nLiked the code? Press ⌘K (Ctrl K) and type %chire-me%c — or just say hi:\n" +
        `✉  ${profile.email}\n⌥  https://github.com/kamranheyderli/portfolioo`,
      "font-size:16px;font-weight:700;color:#00d4ff",
      "color:inherit;font-size:12px",
      "color:#00ffa3;font-family:monospace;font-weight:700",
      "color:inherit;font-size:12px",
    );
  }, []);
  return null;
}

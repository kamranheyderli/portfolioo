"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroller";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Toxunma ekranında Lenis scroll-u yumşaltmır (syncTouch: false), amma hər hadisədə işləyir —
    // telefonda brauzerin öz scroll-u həm daha hamar, həm də daha ucuzdur
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { duration: 1.4 }, lerp: 0.09 });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}

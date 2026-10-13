"use client";

import { useEffect } from "react";

// Service worker yalnız production-da qeydiyyatdan keçir — dev-də köhnə keş qarışıqlıq yaratmasın
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}

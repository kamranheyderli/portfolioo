"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { useM } from "./LangProvider";

function buildVCard(url: string) {
  const [first, ...rest] = profile.name.split(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${profile.name}`,
    `TITLE:${profile.role}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phone.replace(/\s/g, "")}`,
    `URL:${url}`,
    ...profile.socials.filter((s) => s.href.startsWith("http")).map((s) => `X-SOCIALPROFILE;TYPE=${s.label.toLowerCase()}:${s.href}`),
    "ADR;TYPE=WORK:;;;Baku;;;Azerbaijan",
    "END:VCARD",
  ].join("\r\n");
}

export default function QrCard() {
  const t = useM().qr;
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState("");
  const [vcfUrl, setVcfUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // QR kitabxanası yalnız pəncərə açılanda yüklənir
  useEffect(() => {
    if (!open || svg) return;
    const vcard = buildVCard(window.location.origin);
    setVcfUrl(URL.createObjectURL(new Blob([vcard], { type: "text/vcard" })));
    import("qrcode").then((QR) =>
      QR.toString(vcard, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#14131f", light: "#ffffff" } })
        .then(setSvg),
    );
  }, [open, svg]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <>
      <button type="button" className="qr-btn glass" onClick={() => setOpen(true)} data-hover>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4" />
        </svg>
        {t.button}
      </button>

      {/* Pəncərə <main>-dən kənara çıxarılır: main kliksizdir və nav onun üstündədir */}
      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div className="qr-overlay" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="qr-modal glass"
              role="dialog"
              aria-modal="true"
              aria-label={t.title}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
            >
              <h3>{t.title}</h3>
              <div className="qr-code" aria-label="QR code" role="img" dangerouslySetInnerHTML={{ __html: svg }} />
              <p>{t.hint}</p>
              <div className="qr-actions">
                {vcfUrl && (
                  <a className="btn btn-primary" href={vcfUrl} download="Kamran_Heyderli.vcf" data-hover>
                    {t.download}
                  </a>
                )}
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} data-hover autoFocus>
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  );
}

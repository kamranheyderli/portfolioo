"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { useT } from "./LangProvider";
import Magnetic from "./Magnetic";
import ThankYou from "./ThankYou";
import { play } from "@/lib/sound";

type Status = "idle" | "sending" | "success" | "error";

// Mesajlar Formspree hesabına bağlı e-poçta (kamranheyderli33@gmail.com) gəlir
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwlvnkke";

export default function ContactForm() {
  const t = useT().contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [sender, setSender] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("_subject", `Portfolio: ${data.get("name")}`);
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      setSender(String(data.get("name") ?? ""));
      setStatus("success");
      play("success");
      form.reset();
    } catch {
      setStatus("error");
      play("error");
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <ThankYou
          key="thanks"
          name={sender}
          title={t.thanksTitle}
          text={t.thanksText}
          again={t.again}
          onAgain={() => setStatus("idle")}
        />
      ) : (
    <motion.form
      key="form"
      className="contact-form glass"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      transition={{ duration: 0.35 }}
    >
      <div className="form-row">
        <label>
          <span>{t.name}</span>
          <input name="name" required maxLength={100} placeholder={t.namePh} autoComplete="name" />
        </label>
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" required maxLength={200} placeholder={t.emailPh} autoComplete="email" />
        </label>
      </div>
      <label>
        <span>{t.message}</span>
        <textarea name="message" required minLength={5} maxLength={5000} rows={5} placeholder={t.messagePh} />
      </label>
      {/* Botlar üçün gizli sahə — doludursa, Formspree mesajı atır */}
      <input name="_gotcha" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />

      <div className="form-footer">
        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.p key="err" className="form-msg err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {t.error} <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </motion.p>
          )}
        </AnimatePresence>
        <Magnetic>
          <button className="btn btn-primary" type="submit" disabled={status === "sending"} data-hover>
            {status === "sending" ? t.sending : t.send} <span>→</span>
          </button>
        </Magnetic>
      </div>
    </motion.form>
      )}
    </AnimatePresence>
  );
}

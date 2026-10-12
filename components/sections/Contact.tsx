"use client";

import Reveal from "@/components/Reveal";
import Scramble from "@/components/Scramble";
import Magnetic from "@/components/Magnetic";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/lib/data";
import { useT } from "@/components/LangProvider";

export default function Contact() {
  const t = useT();
  return (
    <section id="contact" className="section contact">
      <Reveal><p className="label"><Scramble text={t.contact.label} /></p></Reveal>
      <Reveal delay={0.1}>
        <h2 className="big">
          {t.contact.line1} <br />
          <span className="gradient-text">{t.contact.highlight}</span>{t.contact.line2}
        </h2>
      </Reveal>
      <Reveal delay={0.2} className="form-wrap">
        <ContactForm />
      </Reveal>
      <Reveal delay={0.25}>
        <p className="contact-or">{t.contact.or}</p>
        <Magnetic strength={0.2}>
          <a href={`mailto:${profile.email}`} className="cta" data-hover>
            {profile.email}
            <span>→</span>
          </a>
        </Magnetic>
      </Reveal>
      <Reveal delay={0.3}>
        <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="phone" data-hover>{profile.phone}</a>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="socials">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-hover>{s.label}</a>
          ))}
        </div>
      </Reveal>
      <footer>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{t.contact.location}</span>
      </footer>
    </section>
  );
}

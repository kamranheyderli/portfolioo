"use client";

import Image from "next/image";
import Link from "next/link";
import { companies, profile, skillGroups } from "@/lib/data";
import { useM, useT } from "./LangProvider";
import LangSwitch from "./LangSwitch";

// Çap üçün hazır CV — saytın datasından avtomatik yaranır
export default function CvView() {
  const t = useT();
  const m = useM().cv;
  const links = profile.socials.filter((s) => s.href.startsWith("http"));

  return (
    <div className="cv-page">
      <div className="cv-toolbar">
        <Link href="/" className="btn btn-ghost">{m.back}</Link>
        <LangSwitch />
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>{m.print}</button>
      </div>
      <p className="cv-hint">{m.hint}</p>

      <article className="cv-sheet">
        <header className="cv-head">
          <Image src={profile.photo} alt={profile.name} width={96} height={96} className="cv-photo" priority />
          <div>
            <h1>{profile.name}</h1>
            <p className="cv-role">{profile.role}</p>
            <p className="cv-contacts">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.phone}</span>
              <span>{t.contact.location}</span>
              {links.map((s) => <a key={s.label} href={s.href}>{s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>)}
            </p>
          </div>
        </header>

        <section>
          <h2>{m.summary}</h2>
          <p>{t.about.text}</p>
        </section>

        <section>
          <h2>{t.experience.title}</h2>
          {companies.map((c, i) => (
            <div key={c.company} className="cv-job">
              <div className="cv-job-head">
                <strong>{c.company}</strong>
                <span>{c.role}</span>
                <time>{t.experience.jobs[i].period}</time>
              </div>
              <ul>
                {t.experience.jobs[i].points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <div className="cv-cols">
          <section>
            <h2>{t.skills.title}</h2>
            {skillGroups.map((g) => (
              <p key={g.key} className="cv-skill"><strong>{t.skills.groups[g.key]}:</strong> {g.items.join(", ")}</p>
            ))}
            <p className="cv-skill"><strong>{t.skills.groups.languages}:</strong> {t.skills.languages.join(" · ")}</p>
          </section>
          <section>
            <h2>{t.experience.eduLabel}</h2>
            {t.experience.education.map((e) => (
              <div key={e.title} className="cv-edu">
                <strong>{e.title}</strong>
                <span>{e.detail}</span>
                <time>{e.period}</time>
              </div>
            ))}
          </section>
        </div>
      </article>
    </div>
  );
}

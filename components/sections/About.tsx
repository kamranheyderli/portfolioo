"use client";

import Image from "next/image";
import ScrollWords from "@/components/ScrollWords";
import Reveal from "@/components/Reveal";
import Scramble from "@/components/Scramble";
import { profile } from "@/lib/data";
import { useT } from "@/components/LangProvider";

export default function About() {
  const t = useT();
  return (
    <section id="about" className="section about">
      <div className="about-grid">
        <div className="col">
          <Reveal><p className="label"><Scramble text={t.about.label} /></p></Reveal>
          <Reveal delay={0.1}>
            <h2>
              {t.about.title.map((part, i) => (part.em ? <em key={i}>{part.t}</em> : part.t))}
            </h2>
          </Reveal>
          <Reveal delay={0.2}><ScrollWords className="lead" text={t.about.text} /></Reveal>
          <Reveal delay={0.3}>
            <div className="stats">
              {t.about.stats.map((s) => (
                <div key={s.label} className="glass stat">
                  <strong className="gradient-text">{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="photo-wrap">
          <div className="photo" data-hover>
            <div className="photo-ring" />
            <Image src={profile.photo} alt={profile.name} width={1024} height={1024} sizes="(max-width: 860px) 300px, 420px" />
            <div className="photo-badge glass">
              <span className="pulse" /> {profile.role}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

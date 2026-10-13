"use client";

import Reveal from "@/components/Reveal";
import Scramble from "@/components/Scramble";
import { skillGroups, skills } from "@/lib/data";
import { useT, useX } from "@/components/LangProvider";

export default function Skills() {
  const t = useT();
  const uses = useX().uses;
  const row = [...skills, ...skills];
  const groups = [
    ...skillGroups.map((g) => ({ title: t.skills.groups[g.key], items: g.items as readonly string[] })),
    { title: t.skills.groups.languages, items: t.skills.languages },
  ];
  return (
    <section id="skills" className="section skills">
      <div className="col">
        <Reveal><p className="label"><Scramble text={t.skills.label} /></p></Reveal>
        <Reveal delay={0.1}><h2>{t.skills.title}</h2></Reveal>
      </div>
      <div className="marquee">
        <div className="track">
          {row.map((s, i) => <span key={i}>{s}<i>✦</i></span>)}
        </div>
      </div>
      <div className="marquee reverse">
        <div className="track">
          {[...row].reverse().map((s, i) => <span key={i} className="outline">{s}<i>✦</i></span>)}
        </div>
      </div>
      <div className="skill-groups">
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.1}>
            <div className="glass skill-group">
              <h3>{g.title}</h3>
              <div className="tags">
                {g.items.map((it) => <span key={it}>{it}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={groups.length * 0.1}>
          <div className="glass skill-group uses">
            <h3>{uses.title}</h3>
            <ul>
              {uses.items.map((u) => (
                <li key={u.name}><strong>{u.name}</strong><span>{u.note}</span></li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

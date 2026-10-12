"use client";

import { useRef } from "react";
import Reveal from "@/components/Reveal";
import Scramble from "@/components/Scramble";
import { companies } from "@/lib/data";
import { useT } from "@/components/LangProvider";

type Job = (typeof companies)[number] & { period: string; points: string[] };

function TiltCard({ job, i }: { job: Job; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current!.style.setProperty("--rx", "0deg");
    ref.current!.style.setProperty("--ry", "0deg");
  };

  return (
    <Reveal delay={i * 0.1} className="timeline-item">
      <span className="dot" style={{ background: job.color, boxShadow: `0 0 20px ${job.color}` }} />
      <div
        ref={ref}
        className="card glass"
        style={{ "--accent": job.color } as React.CSSProperties}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="card-glow" />
        <div className="card-top">
          <span className="num">{job.role}</span>
          <span className="year">{job.period}</span>
        </div>
        <h3>{job.company}</h3>
        <ul>
          {job.points.map((pt) => <li key={pt}>{pt}</li>)}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Experience() {
  const t = useT();
  const jobs: Job[] = companies.map((c, i) => ({ ...c, ...t.experience.jobs[i] }));
  return (
    <section id="experience" className="section projects">
      <div className="col right">
        <Reveal><p className="label"><Scramble text={t.experience.label} /></p></Reveal>
        <Reveal delay={0.1}><h2>{t.experience.title}</h2></Reveal>
        <div className="timeline">
          {jobs.map((job, i) => <TiltCard key={job.company} job={job} i={i} />)}
        </div>

        <Reveal delay={0.1}><p className="label edu-label"><Scramble text={t.experience.eduLabel} /></p></Reveal>
        <div className="edu">
          {t.experience.education.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1}>
              <div className="glass edu-item">
                <span className="year">{e.period}</span>
                <strong>{e.title}</strong>
                <span>{e.detail}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

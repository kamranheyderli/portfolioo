"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { profile } from "@/lib/data";
import { useT } from "./LangProvider";
import LangSwitch from "./LangSwitch";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import TerminalButton from "./TerminalButton";

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const t = useT();
  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#experience", label: t.nav.experience },
    { href: "#skills", label: t.nav.skills },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} />
      <motion.nav
        className="nav"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <a href="#top" className="logo" data-hover>
          {profile.name.split(" ").map((w) => w[0]).join("")}
          <span>.</span>
        </a>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} data-hover>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-controls">
          <TerminalButton />
          <ThemeToggle />
          <SoundToggle />
          <LangSwitch />
        </div>
      </motion.nav>
    </>
  );
}

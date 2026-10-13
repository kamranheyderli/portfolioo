"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useX } from "./LangProvider";

// "Səhifə hissəciklərə çevrilib dağılıb" — 404 rəqəmləri dağınıq vəziyyətdən yığılır
export default function NotFoundView() {
  const x = useX().notFound;
  const reduce = useReducedMotion();

  return (
    <main className="nf">
      <h1 className="nf-code" aria-label="404">
        {"404".split("").map((ch, i) => (
          <motion.span
            key={i}
            className="gradient-text"
            initial={reduce ? false : { opacity: 0, y: (i - 1) * 60, x: (i - 1) * 140, rotate: (i - 1) * 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 + i * 0.12 }}
            aria-hidden
          >
            {ch}
          </motion.span>
        ))}
      </h1>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        {x.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
        {x.text}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <Link href="/" className="btn btn-primary">← {x.back}</Link>
      </motion.div>
    </main>
  );
}

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.045 } },
};

const word: Variants = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { type: "spring", stiffness: 240, damping: 24 } },
};

/**
 * Word-by-word "mask wipe" heading reveal — each word slides up out of a
 * clipped box as it scrolls into view, instead of the whole line fading in
 * at once. Plain-string headings only (most section H2s on this site are);
 * for headings built from several differently-styled <span> children, wrap
 * each span's text in its own <TextReveal> rather than trying to pass JSX
 * through this component.
 */
export function TextReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      variants={container}
      className={`inline ${className}`}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

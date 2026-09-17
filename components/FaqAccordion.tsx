"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const reducedMotion = useReducedMotion();

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <motion.button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                className="flex w-full items-center justify-between gap-4 py-6 text-left text-base font-bold text-navy-950 transition-colors hover:text-blue-accent sm:text-lg"
              >
                <span>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 22 }
                  }
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-teal-600" strokeWidth={2} />
                </motion.span>
              </motion.button>
            </h3>

            {/* Kept mounted and collapsed via grid-rows so the panel expands
                instead of appearing; `inert` keeps closed copy off the tab
                order and out of the accessibility tree. The CSS grid-rows
                trick handles the height/overflow clip (no JS height
                measurement needed); framer-motion layers a fade + slight
                rise on the inner content for extra polish on top of it. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0">
                <motion.p
                  animate={
                    reducedMotion
                      ? { opacity: isOpen ? 1 : 0 }
                      : { opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6 }
                  }
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="pb-6 pr-6 text-sm leading-relaxed text-slate-600"
                >
                  {item.answer}
                </motion.p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

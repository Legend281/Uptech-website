"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="py-6">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left gap-4 text-base sm:text-lg font-bold text-navy-950 hover:text-blue-accent transition-colors focus:outline-none"
            >
              <span>{item.question}</span>
              <MaterialIcon
                name="expand_more"
                className={`text-teal-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="mt-3 text-sm text-slate-600 leading-relaxed pr-6">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

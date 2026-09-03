"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQAccordion({
  faqs,
  openDefault = 0,
  tone = "light",
}: {
  faqs: FaqItem[];
  openDefault?: number;
  tone?: "light" | "dark";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    openDefault >= 0 && openDefault < faqs.length ? openDefault : null
  );
  const dark = tone === "dark";

  return (
    <div className={`border-t-2 ${dark ? "border-paper" : "border-ink"}`}>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`border-b ${dark ? "border-paper/25" : "border-ink"}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span className="flex items-start gap-5">
                <span className={`numeral mt-1 text-sm ${dark ? "text-paper/40" : "text-ink/35"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-display text-lg font-bold leading-snug sm:text-xl ${dark ? "text-paper" : "text-ink"}`}>
                  {faq.q}
                </span>
              </span>
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-300 ${
                  isOpen
                    ? dark
                      ? "rotate-45 border-accent-400 bg-accent-400 text-ink"
                      : "rotate-45 border-ink bg-ink text-paper"
                    : dark
                      ? "border-paper/40 text-paper"
                      : "border-ink text-ink"
                }`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className={`pb-6 pl-[calc(1.25rem+1.75rem)] pr-14 text-sm leading-7 sm:text-base ${dark ? "text-paper/70" : "text-ink/70"}`}>
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

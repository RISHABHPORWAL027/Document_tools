"use client";

import React, { useState } from "react";
import { FAQItem } from "@/lib/calculators/types";
import { ChevronDown, HelpCircle } from "lucide-react";

interface Props {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: Props) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#1A2E7E]">
          <HelpCircle className="h-4 w-4" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#1A1C1E]">{title}</h3>
      </div>

      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between gap-3 text-left font-semibold text-xs sm:text-sm text-[#1A1C1E] transition-colors hover:text-[#1A2E7E]"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#1A2E7E]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

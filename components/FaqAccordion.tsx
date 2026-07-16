"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { FaqItem } from "@/lib/blog-engine/parse";

/** Collapsible FAQ accordion for auto-generated blog posts. First item starts
 *  open so a scanning reader (and a crawler) sees at least one full Q&A. */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-2xl font-bold text-[#1a130a]">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={item.question}
              className="rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-bold text-[#1a130a]">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-violet-700 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="px-5 pb-4 leading-relaxed text-[#201810]/70">
                  <ReactMarkdown
                    components={{
                      p: (p) => <p {...p} />,
                      strong: (p) => <strong className="font-semibold text-[#1a130a]" {...p} />,
                      a: (p) => (
                        <a className="font-medium text-violet-700 hover:text-violet-800" {...p} />
                      ),
                      code: (p) => (
                        <code className="rounded bg-[#efe6d2] px-1.5 py-0.5 font-mono text-sm" {...p} />
                      ),
                    }}
                  >
                    {item.answer}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

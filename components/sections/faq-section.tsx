"use client";

import {useState} from "react";
import {SectionHeading} from "@/components/ui/section-heading";
import {PortableTextContent} from "@/components/ui/portable-text";
import {cn} from "@/lib/utils";

interface FaqItem {
  _id: string;
  question: string;
  answer: any;
}

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({items}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items?.length) return null;
  return (
    <section className="relative w-full bg-background py-8 md:py-12 lg:py-16">
      <div className="mb-8">
        <SectionHeading as="h2">FAQ</SectionHeading>
      </div>
      <div className="max-w-3xl mx-auto">
        {items.map((item, idx) => (
          <div key={item._id} className="border-b border-[#e5e0db] last:border-b-0">
            <button
              className={cn(
                "w-full flex justify-between items-center py-5 text-lg md:text-xl text-left transition-colors", // увеличенный размер вопроса
                openIndex === idx ? "text-[#bea692]" : "text-white/90"
              )}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-content-${idx}`}
              style={{outline: "none"}}
            >
              <span style={{fontSize: '1.125rem', lineHeight: 1.3, fontWeight: 500}}>{item.question}</span>
              <span
                className={cn(
                  "ml-4 text-5xl leading-none font-thin transition-transform duration-300", // большой плюс/крестик
                  openIndex === idx ? "rotate-45 text-[#bea692]" : "rotate-0"
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {openIndex === idx && (
              <div
                id={`faq-content-${idx}`}
                className="pb-5 px-1 animate-fadeIn"
              >
                <PortableTextContent value={item.answer} style={{fontSize: '16px', lineHeight: 1.6, fontWeight: 400}} smallFont={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

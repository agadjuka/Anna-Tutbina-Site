"use client";

import {useState, useRef, useLayoutEffect} from "react";
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
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (items?.length) {
      const arr: number[] = items.map((_, i) => {
        const ref = contentRefs.current[i];
        return ref ? ref.scrollHeight : 0;
      });
      setHeights(arr);
    }
  }, [items, openIndex]);

  if (!items?.length) return null;
  return (
    <section className="relative w-full bg-background py-8 md:py-12 lg:py-16">
      <div className="mb-8">
        <SectionHeading as="h2">FAQ</SectionHeading>
      </div>
      <div className="max-w-3xl mx-auto">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item._id} className="border-b border-[#e5e0db] last:border-b-0">
              <button
                className={cn(
                  "w-full flex justify-between items-center py-5 text-lg md:text-xl text-left transition-colors",
                  isOpen ? "text-[#bea692]" : "text-white/90"
                )}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${idx}`}
                style={{ outline: "none" }}
              >
                <span style={{ fontSize: '1.125rem', lineHeight: 1.3, fontWeight: 500 }}>{item.question}</span>
                <span
                  style={{ fontSize: '1.7rem', lineHeight: 1, fontWeight: 200 }}
                  className={cn(
                    "ml-4 leading-none font-thin transition-transform duration-300",
                    isOpen ? "rotate-45 text-[#bea692]" : "rotate-0"
                  )}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                id={`faq-content-${idx}`}
                ref={el => contentRefs.current[idx] = el}
                style={{
                  height: isOpen ? heights[idx] : 0,
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'height 0.4s cubic-bezier(.5,.1,.11,1), opacity 0.3s',
                  willChange: 'height,opacity',
                  pointerEvents: isOpen ? 'auto' : 'none',
                }}
                aria-hidden={!isOpen}
              >
                <div style={{padding: isOpen ? '20px 4px 0 4px' : '0 4px' }}>
                  <PortableTextContent value={item.answer} style={{ fontSize: '16px', lineHeight: 1.6, fontWeight: 400 }} smallFont={true} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

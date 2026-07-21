"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";

interface FaqItem {
  _id: string;
  question: string;
  answer: any;
}

interface FaqSectionProps {
  items: FaqItem[];
}

function PlusIconAnimated({ open }: { open: boolean }) {
  const thickness = 1;
  const length = 14;
  const size = 18;
  return (
    <span
      className={cn(
        "relative block text-primary transition-transform duration-300",
        open ? "rotate-45" : "rotate-0"
      )}
      style={{ width: size, height: size, display: "inline-block" }}
      aria-hidden="true"
    >
      <span
        className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-current"
        style={{ width: length, height: thickness }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 -translate-y-1/2 rounded-sm bg-current"
        style={{ width: thickness, height: length }}
      />
    </span>
  );
}

export function FaqSection({ items }: FaqSectionProps) {
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
    <section className="relative w-full bg-background py-10 md:py-12 lg:py-16">
      <Container>
        <div className="mb-8">
          <SectionHeading as="h2">FAQ</SectionHeading>
        </div>
        <div className="mx-auto max-w-3xl">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item._id} className="border-b border-border last:border-b-0">
                <button
                  className={cn(
                    "flex w-full items-center justify-between py-5 text-left text-lg transition-colors md:text-xl",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isOpen ? "text-primary" : "text-foreground"
                  )}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                >
                  <span className="pr-4 font-medium leading-snug">{item.question}</span>
                  <PlusIconAnimated open={isOpen} />
                </button>
                <div
                  id={`faq-content-${idx}`}
                  ref={(el) => {
                    contentRefs.current[idx] = el;
                  }}
                  className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
                  style={{
                    height: isOpen ? heights[idx] : 0,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                  }}
                  aria-hidden={!isOpen}
                >
                  <div className="px-1 pb-5">
                    <PortableTextContent
                      value={item.answer}
                      smallFont
                      className="leading-relaxed text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

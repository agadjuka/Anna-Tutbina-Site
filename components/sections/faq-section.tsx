"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { Container } from "@/components/ui/container";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface FaqItem {
  _id: string;
  question: string;
  answer: any;
}

interface FaqContent {
  eyebrow?: string;
  heading?: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  faq?: FaqContent | null;
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

export function FaqSection({ items, faq }: FaqSectionProps) {
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
    /* Ритм и оформление сняты с узлов Figma (секция `5:263`, 1920×968):
       эйбрау y=55, заголовок y=112 (интерлиньяж 59), колонка 800px по центру
       (x 560…1360), строки-карточки 800×83 с шагом 96 (то есть зазор 13),
       заливка #fafaf8, радиус 18, вопрос — Cormorant 18px/31.5, «+» 20px primary.
       Раньше здесь были плоские строки с линией-разделителем (осознанное
       отклонение прошлой сессии) — 2026-08-20 приводим к макету. */
    <section id="faq" className="relative w-full bg-background py-16 lg:min-h-[min(50.4vw,968px)] lg:py-[min(2.86vw,55px)]">
      <Container>
        <div className="mb-10 text-center lg:mb-[min(4.99vw,96px)]">
          <SectionEyebrow className="text-subtle">
            {faq?.eyebrow || "Частые вопросы"}
          </SectionEyebrow>
          <h2 className="mt-3 font-heading text-[32px] leading-tight text-foreground sm:text-[33px] lg:mt-[min(1.77vw,34px)] lg:text-[min(2.6vw,50px)] lg:leading-[min(3.07vw,59px)]">
            {faq?.heading || "FAQ"}
          </h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-2 lg:max-w-[min(41.7vw,800px)] lg:space-y-[min(0.68vw,13px)]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item._id} className="rounded-[18px] bg-on-primary px-4 lg:px-[min(1.35vw,26px)]">
                <button
                  className={cn(
                    "flex w-full items-center justify-between py-5 text-left text-lg transition-colors md:text-xl lg:min-h-[min(4.32vw,83px)] lg:py-0 lg:text-[clamp(12px,0.9375vw,18px)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isOpen ? "text-primary" : "text-foreground"
                  )}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                >
                  {/* `font-heading` без варианта `lg:` — это класс из `@layer utilities`
                      в globals.css, у него нет адаптивных вариантов (Tailwind их не
                      генерирует для рукописных утилит), `lg:font-heading` молча не
                      работает. В макете вопрос и так набран Cormorant на всех
                      экранах. */}
                  <span className="pr-4 font-heading font-normal leading-snug lg:leading-[min(1.64vw,31.5px)]">
                    {item.question}
                  </span>
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
                  <div className="px-1 pb-5 lg:px-0 lg:pb-[min(1.35vw,26px)]">
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

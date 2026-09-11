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
    <section id="faq" className="relative w-full bg-background py-16 lg:min-h-[calc(527.39*var(--ona-u))] lg:py-[calc(20.13*var(--ona-u))]">
      <Container>
        <div className="mb-10 text-center lg:mb-[calc(35.13*var(--ona-u))]">
          <SectionEyebrow className="text-subtle">
            {faq?.eyebrow || "Частые вопросы"}
          </SectionEyebrow>
          <h2 className="mt-3 font-heading text-[32px] leading-tight text-foreground sm:text-[33px] lg:mt-[calc(12.46*var(--ona-u))] lg:text-[calc(22.63*var(--ona-u))] lg:leading-[calc(26.72*var(--ona-u))]">
            {faq?.heading || "FAQ"}
          </h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-2 lg:max-w-[calc(384.31*var(--ona-u))] lg:space-y-[calc(7.12*var(--ona-u))]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item._id} className="rounded-[18px] bg-on-primary px-4 lg:px-[calc(14.13*var(--ona-u))]">
                <button
                  className={cn(
                    "flex w-full items-center justify-between py-5 text-left text-lg transition-colors md:text-xl lg:min-h-[calc(45.2*var(--ona-u))] lg:py-0 lg:text-[calc(13*var(--ona-u))]",
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
                  <span className="pr-4 font-heading font-normal leading-snug lg:leading-[calc(17.16*var(--ona-u))]">
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
                  {/* Паддинг — на ВНУТРЕННЕМ div, а не на обёртке `faq-content-…`: та
                      держит высоту аккордеона инлайн-стилем, и паддинг на ней
                      оставался бы видимым при `height:0`. `p, li` — часть
                      ответов свёрстана списком. */}
                  <div className="px-1 pb-5 lg:px-0 lg:pb-[calc(14.13*var(--ona-u))] lg:[&_li]:text-[calc(13.08*var(--ona-u))] lg:[&_p]:text-[calc(13.08*var(--ona-u))]">
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

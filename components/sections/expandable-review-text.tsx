"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useReviewsExpand } from "@/components/sections/reviews-expand-context";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const { allExpanded, expandAll } = useReviewsExpand();
  /** null — ещё не измерили (нет мигания кавычки/кнопки) */
  const [canExpand, setCanExpand] = useState<boolean | null>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const expanded = allExpanded;

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    if (expanded) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  useLayoutEffect(() => {
    measure();
    const el = textRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, text, expanded]);

  const showClosingQuote = canExpand === false || (canExpand === true && expanded);

  return (
    <div className="-mt-2 flex min-h-0 flex-1 flex-col">
      <div className={cn("relative", canExpand === true && !expanded && "pb-1")}>
        <Paragraph
          ref={textRef}
          className={cn(
            "mb-0 text-sm md:text-base italic leading-[1.8] text-muted-foreground",
            !expanded && "line-clamp-4"
          )}
        >
          {text}
        </Paragraph>
        {canExpand === true && !expanded && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent"
            aria-hidden
          />
        )}
      </div>

      {showClosingQuote && (
        <div className="mt-1 shrink-0 text-right font-heading text-3xl leading-none text-[#bea692]/20 md:mt-2 md:text-4xl">
          {"\u201D"}
        </div>
      )}

      {canExpand === true && !expanded && (
        <div className="mt-3 flex shrink-0 justify-center">
          <button
            type="button"
            onClick={expandAll}
            aria-expanded={false}
            className="group/btn inline-flex items-center gap-1.5 rounded-full border border-[#e5e0db] bg-white/80 px-3.5 py-1.5 font-sans text-xs text-muted-foreground transition-colors hover:border-[#bea692]/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bea692]/25 md:text-sm"
          >
            <span>Читать дальше</span>
            <svg
              className="h-3 w-3 shrink-0 text-[#bea692]/70 transition-transform duration-300 group-hover/btn:text-[#bea692]"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReviewsExpand } from "@/components/sections/reviews-expand-context";
import { FitOneLineActionLabel } from "@/components/sections/fit-one-line-action-label";
import {
  reviewActionButtonClass,
  reviewActionIconClass,
} from "@/components/sections/review-action-button-styles";
import { Paragraph } from "@/components/ui/paragraph";
import { reviewCardTextWrapClass } from "@/lib/review-card-text";
import { cn } from "@/lib/utils";

const ANIM_EXPAND_MS = 640;
const ANIM_COLLAPSE_MS = 580;
/** Плавное «выезжание» вниз */
const EASE_EXPAND = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Спокойное подтягивание без рывка */
const EASE_COLLAPSE = "cubic-bezier(0.4, 0, 0.2, 1)";
const EASE_OPACITY = "cubic-bezier(0.33, 1, 0.68, 1)";
const COLLAPSED_LINES = 4;

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const { allExpanded, expandAll } = useReviewsExpand();

  const [canExpand, setCanExpand] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const finishTimerRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = pRef.current;
    if (!el) return;

    const computed = window.getComputedStyle(el);
    const lineHeight = Number.parseFloat(computed.lineHeight || "0");
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;

    const collapsed = Math.max(1, Math.round(lineHeight * COLLAPSED_LINES));
    const expanded = Math.max(1, Math.round(el.scrollHeight));
    const expandable = expanded > collapsed + 1;

    setCollapsedHeight(collapsed);
    setExpandedHeight(expanded);
    setCanExpand(expandable);
    setContentHeight(expandable ? (allExpanded ? expanded : collapsed) : expanded);
  }, [allExpanded]);

  useLayoutEffect(() => {
    measure();
    const el = pRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, text]);

  useLayoutEffect(() => {
    if (finishTimerRef.current) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }

    if (!canExpand) {
      setIsAnimating(false);
      setContentHeight(expandedHeight);
      return;
    }

    const target = allExpanded ? expandedHeight : collapsedHeight;
    setIsAnimating(true);
    setContentHeight(target);

    const duration = allExpanded ? ANIM_EXPAND_MS : ANIM_COLLAPSE_MS;
    finishTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      finishTimerRef.current = null;
    }, duration + 80);
  }, [allExpanded, canExpand, collapsedHeight, expandedHeight]);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const expanded = canExpand ? allExpanded : true;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        ref={wrapRef}
        className={cn(
          "relative min-w-0 overflow-hidden",
          canExpand && !expanded && "pb-1"
        )}
        style={{
          height: canExpand ? `${contentHeight}px` : undefined,
          transition: canExpand
            ? `height ${allExpanded ? ANIM_EXPAND_MS : ANIM_COLLAPSE_MS}ms ${allExpanded ? EASE_EXPAND : EASE_COLLAPSE}`
            : undefined,
          willChange: isAnimating ? "height" : undefined,
        }}
      >
        <Paragraph
          ref={pRef}
          className={cn(
            "mb-0 text-sm md:text-base italic leading-[1.8] text-muted-foreground transition-opacity",
            reviewCardTextWrapClass
          )}
          style={{
            opacity: canExpand ? (expanded ? 1 : 0.98) : 1,
            transitionDuration: `${Math.round(
              (allExpanded ? ANIM_EXPAND_MS : ANIM_COLLAPSE_MS) * 0.82
            )}ms`,
            transitionTimingFunction: EASE_OPACITY,
          }}
        >
          {text}
        </Paragraph>
        {canExpand && (
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent transition-opacity duration-300 ease-out",
              expanded ? "opacity-0" : "opacity-100"
            )}
            aria-hidden
          />
        )}
      </div>

      {canExpand && (
        <div
          className={cn(
            "flex w-full min-w-0 shrink-0 justify-center overflow-hidden transition-all duration-300 ease-out",
            expanded
              ? "mt-0 max-h-0 -translate-y-1 opacity-0 pointer-events-none"
              : "mt-3 max-h-16 translate-y-0 opacity-100"
          )}
        >
          <button
            type="button"
            onClick={expandAll}
            aria-expanded={expanded}
            className={reviewActionButtonClass}
          >
            <FitOneLineActionLabel>Читать дальше</FitOneLineActionLabel>
            <svg
              className={reviewActionIconClass}
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

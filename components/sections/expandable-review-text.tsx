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

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const { allExpanded, expandAll } = useReviewsExpand();

  const [canExpand, setCanExpand] = useState<boolean | null>(null);
  const [localExpanded, setLocalExpanded] = useState(allExpanded);

  const wrapRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const collapsedTextHRef = useRef(0);
  const prevCtxExpanded = useRef(allExpanded);
  const timersRef = useRef<number[]>([]);

  const expanded = localExpanded;

  const measure = useCallback(() => {
    const el = pRef.current;
    if (!el) return;
    if (expanded) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

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
  }, [measure, text, expanded]);

  useLayoutEffect(() => {
    const p = pRef.current;
    if (p && !localExpanded && canExpand === true) {
      collapsedTextHRef.current = Math.round(p.getBoundingClientRect().height);
    }
  }, [localExpanded, canExpand, text]);

  useLayoutEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };

    const cleanupStyles = (el: HTMLElement) => {
      el.style.height = "";
      el.style.overflow = "";
      el.style.transition = "";
      el.style.opacity = "";
      el.style.willChange = "";
    };

    const animateExpand = () => {
      const p = pRef.current;
      if (!p) return;

      clearTimers();
      const from = Math.round(p.getBoundingClientRect().height);

      p.style.height = `${from}px`;
      p.style.overflow = "hidden";
      p.style.willChange = "height, opacity";
      p.style.opacity = "0.94";

      setLocalExpanded(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = pRef.current;
          if (!el) return;

          const to = Math.max(1, Math.round(el.scrollHeight));
          const opacityMs = Math.round(ANIM_EXPAND_MS * 0.85);

          if (Math.abs(to - from) <= 1) {
            cleanupStyles(el);
            return;
          }

          el.style.transition = `height ${ANIM_EXPAND_MS}ms ${EASE_EXPAND}, opacity ${opacityMs}ms ${EASE_OPACITY}`;
          el.style.height = `${to}px`;
          el.style.opacity = "1";

          let done = false;
          const finish = (e?: TransitionEvent) => {
            if (e && (e.target !== el || e.propertyName !== "height")) return;
            if (done) return;
            done = true;
            el.removeEventListener("transitionend", finish);
            clearTimers();
            cleanupStyles(el);
          };

          el.addEventListener("transitionend", finish);
          timersRef.current.push(
            window.setTimeout(() => finish(), ANIM_EXPAND_MS + 120)
          );
        });
      });
    };

    const animateCollapse = () => {
      const p = pRef.current;
      if (!p) return;

      clearTimers();
      const from = Math.round(p.getBoundingClientRect().height);
      const to = Math.max(1, collapsedTextHRef.current || Math.round(from * 0.33));
      const opacityMs = Math.round(ANIM_COLLAPSE_MS * 0.75);

      p.style.height = `${from}px`;
      p.style.overflow = "hidden";
      p.style.willChange = "height, opacity";
      p.style.opacity = "1";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = pRef.current;
          if (!el) return;

          if (Math.abs(to - from) <= 1) {
            setLocalExpanded(false);
            requestAnimationFrame(() => cleanupStyles(el));
            return;
          }

          el.style.transition = `height ${ANIM_COLLAPSE_MS}ms ${EASE_COLLAPSE}, opacity ${opacityMs}ms ${EASE_COLLAPSE}`;
          el.style.height = `${to}px`;
          el.style.opacity = "0.92";

          let done = false;
          const finish = (e?: TransitionEvent) => {
            if (e && (e.target !== el || e.propertyName !== "height")) return;
            if (done) return;
            done = true;
            el.removeEventListener("transitionend", finish);
            clearTimers();
            setLocalExpanded(false);
            requestAnimationFrame(() => cleanupStyles(el));
          };

          el.addEventListener("transitionend", finish);
          timersRef.current.push(
            window.setTimeout(() => finish(), ANIM_COLLAPSE_MS + 120)
          );
        });
      });
    };

    if (canExpand !== true) {
      clearTimers();
      setLocalExpanded(allExpanded);
      prevCtxExpanded.current = allExpanded;
      return;
    }

    const prev = prevCtxExpanded.current;
    const rising = allExpanded && !prev;
    const falling = !allExpanded && prev;

    if (!rising && !falling) {
      prevCtxExpanded.current = allExpanded;
      return;
    }

    const p = pRef.current;
    if (!p) {
      prevCtxExpanded.current = allExpanded;
      return;
    }

    if (rising) {
      prevCtxExpanded.current = allExpanded;
      animateExpand();
      return;
    }

    if (falling) {
      prevCtxExpanded.current = allExpanded;
      animateCollapse();
    }
  }, [allExpanded, canExpand]);

  useEffect(() => () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        ref={wrapRef}
        className={cn(
          "relative min-w-0",
          canExpand === true && !expanded && "pb-1"
        )}
      >
        <Paragraph
          ref={pRef}
          className={cn(
            "mb-0 text-sm md:text-base italic leading-[1.8] text-muted-foreground",
            reviewCardTextWrapClass,
            !expanded && "line-clamp-4"
          )}
        >
          {text}
        </Paragraph>
        {canExpand === true && (
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent transition-opacity duration-300 ease-out",
              expanded ? "opacity-0" : "opacity-100"
            )}
            aria-hidden
          />
        )}
      </div>

      {canExpand === true && (
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

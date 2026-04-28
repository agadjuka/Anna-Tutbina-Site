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
  const collapsedHRef = useRef(0);
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
    const wrap = wrapRef.current;
    if (wrap && !localExpanded && canExpand === true) {
      collapsedHRef.current = wrap.scrollHeight;
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

    const animateParagraphHeight = (
      toExpanded: boolean,
      durationMs: number,
      easing: string
    ) => {
      const p = pRef.current;
      if (!p) return;

      clearTimers();
      const from = Math.round(p.getBoundingClientRect().height);
      const targetOpacity = toExpanded ? "1" : "0.92";

      p.style.height = `${from}px`;
      p.style.overflow = "hidden";
      p.style.willChange = "height, opacity";
      p.style.opacity = toExpanded ? "0.94" : "1";

      setLocalExpanded(toExpanded);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = pRef.current;
          if (!el) return;

          const to = Math.max(1, Math.round(el.scrollHeight));
          const opacityMs = Math.round(durationMs * (toExpanded ? 0.85 : 0.75));

          if (Math.abs(to - from) <= 1) {
            cleanupStyles(el);
            return;
          }

          el.style.transition = `height ${durationMs}ms ${easing}, opacity ${opacityMs}ms ${toExpanded ? EASE_OPACITY : easing}`;
          el.style.height = `${to}px`;
          el.style.opacity = targetOpacity;

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
          timersRef.current.push(window.setTimeout(() => finish(), durationMs + 120));
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
      animateParagraphHeight(true, ANIM_EXPAND_MS, EASE_EXPAND);
      return;
    }

    if (falling) {
      prevCtxExpanded.current = allExpanded;
      animateParagraphHeight(false, ANIM_COLLAPSE_MS, EASE_COLLAPSE);
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
        {canExpand === true && !expanded && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out"
            aria-hidden
          />
        )}
      </div>

      {canExpand === true && !expanded && (
        <div className="mt-3 flex w-full min-w-0 shrink-0 justify-center">
          <button
            type="button"
            onClick={expandAll}
            aria-expanded={false}
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

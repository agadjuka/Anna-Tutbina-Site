"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReviewsExpand } from "@/components/sections/reviews-expand-context";
import {
  reviewActionButtonClass,
  reviewActionIconClass,
} from "@/components/sections/review-action-button-styles";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";

const ANIM_EXPAND_MS = 640;
const ANIM_COLLAPSE_MS = 580;
/** Плавное «выезжание» вниз */
const EASE_EXPAND = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Спокойное подтягивание без рывка */
const EASE_COLLAPSE = "cubic-bezier(0.4, 0, 0.2, 1)";
const EASE_OPACITY = "cubic-bezier(0.33, 1, 0.68, 1)";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const { allExpanded, expandAll } = useReviewsExpand();
  const reducedMotion = usePrefersReducedMotion();

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

    if (reducedMotion) {
      clearTimers();
      setLocalExpanded(allExpanded);
      prevCtxExpanded.current = allExpanded;
      return;
    }

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

    const wrap = wrapRef.current;
    const p = pRef.current;
    if (!wrap || !p) {
      prevCtxExpanded.current = allExpanded;
      return;
    }

    if (rising) {
      clearTimers();
      prevCtxExpanded.current = allExpanded;
      const from = collapsedHRef.current || wrap.scrollHeight;
      wrap.style.overflow = "hidden";
      wrap.style.maxHeight = `${from}px`;
      wrap.style.willChange = "max-height, opacity";
      wrap.style.opacity = "0.94";
      setLocalExpanded(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const w = wrapRef.current;
          if (!w) return;
          const to = Math.max(w.scrollHeight, from);
          const opacityMs = Math.round(ANIM_EXPAND_MS * 0.85);
          w.style.transition = `max-height ${ANIM_EXPAND_MS}ms ${EASE_EXPAND}, opacity ${opacityMs}ms ${EASE_OPACITY}`;
          w.style.maxHeight = `${to}px`;
          w.style.opacity = "1";

          let done = false;
          const finish = (e?: TransitionEvent) => {
            if (e && (e.target !== w || e.propertyName !== "max-height")) return;
            if (done) return;
            done = true;
            w.removeEventListener("transitionend", finish);
            clearTimers();
            w.style.maxHeight = "";
            w.style.overflow = "";
            w.style.transition = "";
            w.style.opacity = "";
            w.style.willChange = "";
          };
          w.addEventListener("transitionend", finish);
          timersRef.current.push(
            window.setTimeout(() => finish(), ANIM_EXPAND_MS + 100)
          );
        });
      });
      return;
    }

    if (falling) {
      clearTimers();
      prevCtxExpanded.current = allExpanded;
      const from = wrap.scrollHeight;
      wrap.style.overflow = "hidden";
      wrap.style.maxHeight = `${from}px`;
      wrap.style.willChange = "max-height, opacity";
      wrap.style.opacity = "1";

      requestAnimationFrame(() => {
        const w = wrapRef.current;
        if (!w) return;
        const to = collapsedHRef.current || Math.round(from * 0.28);
        const opacityMs = Math.round(ANIM_COLLAPSE_MS * 0.75);
        w.style.transition = `max-height ${ANIM_COLLAPSE_MS}ms ${EASE_COLLAPSE}, opacity ${opacityMs}ms ${EASE_COLLAPSE}`;
        w.style.maxHeight = `${to}px`;
        w.style.opacity = "0.92";

        let done = false;
        const finish = (e?: TransitionEvent) => {
          if (e && (e.target !== w || e.propertyName !== "max-height")) return;
          if (done) return;
          done = true;
          w.removeEventListener("transitionend", finish);
          clearTimers();
          setLocalExpanded(false);
          w.style.maxHeight = "";
          w.style.overflow = "";
          w.style.transition = "";
          w.style.opacity = "";
          w.style.willChange = "";
        };
        w.addEventListener("transitionend", finish);
        timersRef.current.push(
          window.setTimeout(() => finish(), ANIM_COLLAPSE_MS + 100)
        );
      });
    }
  }, [allExpanded, canExpand, reducedMotion]);

  useEffect(() => () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const showClosingQuote = canExpand === false || (canExpand === true && expanded);
  const quoteVisible = canExpand === false || expanded;

  return (
    <div className="-mt-2 flex min-h-0 flex-1 flex-col">
      <div
        ref={wrapRef}
        className={cn("relative", canExpand === true && !expanded && "pb-1")}
      >
        <Paragraph
          ref={pRef}
          className={cn(
            "mb-0 text-sm md:text-base italic leading-[1.8] text-muted-foreground",
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

      {showClosingQuote && (
        <div
          className={cn(
            "mt-1 shrink-0 text-right font-heading text-3xl leading-none text-[#bea692]/20 md:mt-2 md:text-4xl",
            canExpand === true &&
              "motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
            canExpand === true &&
              expanded &&
              "motion-safe:delay-100 motion-safe:duration-[560ms]",
            quoteVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          )}
        >
          {"\u201D"}
        </div>
      )}

      {canExpand === true && !expanded && (
        <div className="mt-3 flex shrink-0 justify-center">
          <button
            type="button"
            onClick={expandAll}
            aria-expanded={false}
            className={reviewActionButtonClass}
          >
            <span className="relative z-10">Читать дальше</span>
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

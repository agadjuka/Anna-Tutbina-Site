"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MIN_PX = 8;

function fitLabelToButton(span: HTMLSpanElement, button: HTMLButtonElement) {
  span.style.fontSize = "";
  void span.offsetWidth;

  const bcs = getComputedStyle(button);
  const padL = parseFloat(bcs.paddingLeft);
  const padR = parseFloat(bcs.paddingRight);
  const gapStr = bcs.gap;
  const gap = gapStr && gapStr !== "normal" ? parseFloat(gapStr) : 6;
  const svg = button.querySelector("svg");
  const iconW = svg?.getBoundingClientRect().width ?? 0;
  const available = button.clientWidth - padL - padR - gap - iconW;

  if (available <= MIN_PX) return;

  const maxPx = parseFloat(getComputedStyle(span).fontSize);
  span.style.fontSize = `${maxPx}px`;

  if (span.scrollWidth <= available) {
    span.style.fontSize = "";
    return;
  }

  let lo = MIN_PX;
  let hi = maxPx;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    span.style.fontSize = `${mid}px`;
    if (span.scrollWidth <= available) lo = mid;
    else hi = mid;
  }
  span.style.fontSize = `${lo}px`;
}

/**
 * Подпись кнопки отзыва («Читать дальше» / «Свернуть») — всегда одна строка;
 * при нехватке места шрифт уменьшается до минимума MIN_PX.
 */
export function FitOneLineActionLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    const button = span.closest("button");
    if (!button) return;

    const run = () => fitLabelToButton(span, button);

    run();
    const ro = new ResizeObserver(run);
    ro.observe(button);
    window.addEventListener("resize", run);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [children]);

  return (
    <span
      ref={spanRef}
      className={cn("relative z-10 min-w-0 whitespace-nowrap", className)}
    >
      {children}
    </span>
  );
}

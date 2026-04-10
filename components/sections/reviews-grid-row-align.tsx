"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * Выравнивает высоту блоков [data-review-header] по рядам сетки,
 * чтобы разделитель и начало текста совпадали в каждом горизонтальном ряду карточек.
 */
export function ReviewsGridRowAlign({
  children,
  className,
  alignKey,
}: {
  children: ReactNode;
  className?: string;
  /** Смена списка отзывов — пересчитать высоты */
  alignKey?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const run = () => {
      const headers = Array.from(
        root.querySelectorAll<HTMLElement>("[data-review-header]")
      );
      headers.forEach((h) => {
        h.style.minHeight = "";
      });

      if (headers.length === 0) return;

      const sorted = [...headers].sort(
        (a, b) =>
          a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

      const tolerance = 2;
      const rows: HTMLElement[][] = [];
      for (const h of sorted) {
        const top = h.getBoundingClientRect().top;
        const last = rows[rows.length - 1];
        if (
          !last ||
          Math.abs(last[0].getBoundingClientRect().top - top) >= tolerance
        ) {
          rows.push([h]);
        } else {
          last.push(h);
        }
      }

      for (const row of rows) {
        const maxH = Math.max(
          ...row.map((el) => el.getBoundingClientRect().height)
        );
        for (const el of row) {
          el.style.minHeight = `${Math.ceil(maxH)}px`;
        }
      }
    };

    const schedule = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(run);
      });
    };
    schedule();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(run);
    });
    ro.observe(root);
    window.addEventListener("resize", run);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [alignKey]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}

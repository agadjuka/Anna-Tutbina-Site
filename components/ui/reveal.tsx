"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Задержка появления в мс — для «волной» проявляющихся соседних блоков. */
  delayMs?: number;
  /** `up` (по умолчанию) — снизу вверх, `fade` — только прозрачность, без сдвига. */
  variant?: "up" | "fade";
}

/**
 * Проявление блока при попадании во вьюпорт — обёртка без собственной вёрстки,
 * не меняет поток документа (`div` без стилей, кроме анимационных). Используется
 * только на сравнительной странице `/animated-preview` (см. `docs/redesign/backlog.md`
 * п.11) — оборачивает уже существующие серверные секции главной как есть, без
 * дублирования их кода.
 */
export function Reveal({ children, className, delayMs = 0, variant = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        visible
          ? "opacity-100 translate-y-0"
          : variant === "up"
            ? "opacity-0 translate-y-10"
            : "opacity-0",
        className
      )}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

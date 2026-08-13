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
 * не меняет поток документа. Используется версиями главной с анимацией
 * (см. `docs/VERSIONS.md`), оборачивает обычные серверные секции без дублирования кода.
 *
 * При системной настройке «уменьшить анимацию» блок не выключается совсем, а
 * переходит на появление ТОЛЬКО прозрачностью, без сдвига по вертикали:
 * дискомфорт вызывает именно движение, а плавное затухание безопасно.
 *
 * Исключение — страницы `/versions/*` (см. `force-motion.tsx`): там анимация
 * форсируется через `<html data-force-motion="true">` независимо от системной
 * настройки, потому что это страница для оценки самой анимации — приглушать её
 * там бессмысленно (так и произошло на практике: заказчик с этой настройкой на
 * устройстве не видел вообще никакого движения при просмотре версии 2).
 */
export function Reveal({ children, className, delayMs = 0, variant = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const forced = document.documentElement.getAttribute("data-force-motion") === "true";
    setReducedMotion(!forced && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    /* `threshold: 0`, а не доля площади. С прежним `0.12` секции, которые
       заметно выше экрана (на мобильном это отзывы, FAQ, CALENDAR), могли
       НИКОГДА не показаться: видимая доля такого блока физически не достигает
       12% — при высоте блока больше ~8 экранов максимум равен
       `высота экрана / высота блока`. Блок навсегда оставался `opacity: 0` —
       на его месте был пустой светлый прямоугольник, и казалось, что страница
       не листается дальше HERO.

       Теперь срабатывает от любого пересечения, а `rootMargin` снизу даёт
       появиться чуть раньше, чем блок доедет до края экрана. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenClass =
    reducedMotion || variant === "fade" ? "opacity-0" : "opacity-0 translate-y-10";

  return (
    <div
      ref={ref}
      /* `data-revealed` — зацепка для CSS: по ней стили версии могут запускать
         собственные анимации внутри секции (например, поштучное появление
         карточек), не завися от классов Tailwind на этой обёртке. */
      data-revealed={visible ? "true" : "false"}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        visible ? "opacity-100 translate-y-0" : hiddenClass,
        className
      )}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

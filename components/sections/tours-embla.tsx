"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TourCardWrapper } from "./tour-card-wrapper";
import { cn } from "@/lib/utils";

interface Price { value: number; currency: string }
interface Tour {
  _id: string;
  name: string;
  slug: { current: string };
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: Price;
}

interface ToursEmblaProps { tours: Tour[] }

export function ToursEmbla({ tours }: ToursEmblaProps) {
  const options: EmblaOptionsType = {
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    inViewThreshold: 0.25,
  };

  const [viewportRef, embla] = useEmblaCarousel(options);
  // null = ничего не активно
  const [active, setActive] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  // Границы центральной зоны и гистерезис (чтобы не мигало на границе)
  const ACTIVATE_TOP = 0.2;   // активируем, если центр попал в [20%, 80%]
  const ACTIVATE_BOTTOM = 0.8;
  const DEACTIVATE_TOP = 0.18;  // деактивируем, только если вышел за [18%, 82%]
  const DEACTIVATE_BOTTOM = 0.82;

  const getSelectedCenterPercent = useCallback((api: EmblaCarouselType) => {
    const idx = api.selectedScrollSnap();
    const slide = api.slideNodes()[idx] as HTMLElement | undefined;
    if (!slide) return null;
    const rect = slide.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const centerY = rect.top + rect.height / 2;
    return centerY / vh; // 0..1
  }, []);

  const activateIfEligible = useCallback((api: EmblaCarouselType) => {
    if (!api) return;
    const p = getSelectedCenterPercent(api);
    if (p == null) return;
    const idx = api.selectedScrollSnap();

    // Если уже активен этот же слайд — держим активным, пока он в мягкой зоне
    if (active === idx) {
      if (p >= DEACTIVATE_TOP && p <= DEACTIVATE_BOTTOM) return; // остаётся активным
      setActive(null); // вышел из зоны — деактивируем
      return;
    }

    // Иначе активируем только если попал в жёсткую центральную зону
    if (p >= ACTIVATE_TOP && p <= ACTIVATE_BOTTOM) {
      setActive(idx);
    }
  }, [active, getSelectedCenterPercent]);

  useEffect(() => {
    if (!embla) return;
    embla.on("pointerDown", () => {
      isDraggingRef.current = true;
    });
    embla.on("pointerUp", () => {
      isDraggingRef.current = false;
    });
    // Во время горизонтального скролла сразу пересчитываем активность по вертикальному центру
    embla.on("scroll", () => activateIfEligible(embla));
    embla.on("select", () => activateIfEligible(embla));
    embla.on("settle", () => activateIfEligible(embla));
    // Начальная проверка
    activateIfEligible(embla);
  }, [embla, activateIfEligible]);

  // Во время вертикального скролла страницы — активируем ТОЛЬКО после остановки в центральной зоне
  useEffect(() => {
    let t: any;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (embla && !isDraggingRef.current) activateIfEligible(embla);
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [embla, activateIfEligible]);

  // Ширина 80vw, макс 400
  const slideStyle = useMemo(() => ({ flex: "0 0 80%", maxWidth: 400 } as React.CSSProperties), []);

  return (
    <div className="md:hidden pt-6 -mx-4 px-4">
      <div className="overflow-x-hidden overflow-y-visible py-2" ref={viewportRef}>
        <div className={cn("flex gap-6")}> 
          {tours.map((t, i) => (
            <div key={t._id} style={slideStyle}>
              <TourCardWrapper tour={t} isActive={active === i} className="[&>div]:!aspect-[4/5]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



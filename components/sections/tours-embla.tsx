"use client";

import useEmblaCarousel, { type EmblaOptionsType, type EmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TourCard } from "./tour-card";
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

  // Проверяем, находится ли текущий выбранный слайд в центральной 60% экрана
  const isSelectedInVerticalCenter = useCallback((api: EmblaCarouselType) => {
    const idx = api.selectedScrollSnap();
    const slide = api.slideNodes()[idx] as HTMLElement | undefined;
    if (!slide) return false;
    const rect = slide.getBoundingClientRect();
    const vh = window.innerHeight;
    const topBound = vh * 0.2; // верхняя граница центральной зоны (20%)
    const bottomBound = vh * 0.8; // нижняя граница (80%)
    const slideCenterY = rect.top + rect.height / 2;
    return slideCenterY >= topBound && slideCenterY <= bottomBound;
  }, []);

  const activateIfEligible = useCallback((api: EmblaCarouselType) => {
    if (!api) return;
    if (isSelectedInVerticalCenter(api)) {
      setActive(api.selectedScrollSnap());
    } else {
      setActive(null);
    }
  }, [isSelectedInVerticalCenter]);

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
              <TourCard tour={t} isActive={active === i} className="[&>div]:!aspect-[4/5]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



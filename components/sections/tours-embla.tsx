"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TourCalendarCard } from "@/components/sections/tour-calendar-card";
import { cn } from "@/lib/utils";

interface Tour {
  _id: string;
  name: string;
  slug: { current: string };
  cardImage?: any;
  mainImage?: any;
  dates?: string;
  overlayName?: string | null;
  overlayDate?: string | null;
}

interface ToursEmblaProps {
  tours: Tour[];
}

/** Те же круглые стрелки-обводки, что и в ReviewsEmbla/ProgramDaysCarousel — общий язык каруселей проекта. */
const arrowClass = cn(
  "flex items-center justify-center rounded-full",
  "border-2 border-primary bg-transparent shadow-md backdrop-blur-sm",
  "transition-all duration-200",
  "disabled:opacity-30 disabled:cursor-not-allowed"
);
const arrowHover = "hover:bg-primary/10 hover:shadow-xl hover:scale-110 disabled:hover:scale-100";
const arrowActive = "active:bg-primary/15 active:shadow-xl active:scale-110 disabled:active:scale-100";

function ArrowIconLeft({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cn("text-primary", className)} aria-hidden>
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIconRight({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cn("text-primary", className)} aria-hidden>
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Карусель карточек тура для CALENDAR — по образцу `reviews-embla.tsx` (см.
 * `docs/redesign/backlog.md` п.5): старый `tours-embla.tsx` был вёрстан под
 * прежний дизайн карточки и удалён вместе со старой секцией «Наши туры»,
 * этот собран заново под `tour-calendar-card.tsx`. Упор на мобильную версию —
 * один слайд с подглядыванием следующего, крупные стрелки снизу; на lg — 3
 * карточки в ряд, как было в статичной сетке.
 */
export function ToursEmbla({ tours }: ToursEmblaProps) {
  const options = useMemo(
    () =>
      ({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false,
        skipSnaps: false,
        duration: 26,
      }) satisfies EmblaOptionsType,
    []
  );

  const [viewportRef, embla] = useEmblaCarousel(options);

  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const toursKey = useMemo(() => tours.map((t) => t._id).join("|"), [tours]);

  const syncFromApi = useCallback((api: EmblaCarouselType) => {
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!embla) return;
    syncFromApi(embla);
    embla.on("select", syncFromApi);
    embla.on("reInit", syncFromApi);
    embla.on("scroll", syncFromApi);
    return () => {
      embla.off("select", syncFromApi);
      embla.off("reInit", syncFromApi);
      embla.off("scroll", syncFromApi);
    };
  }, [embla, syncFromApi]);

  useEffect(() => {
    embla?.reInit();
  }, [embla, toursKey]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  const single = tours.length <= 1;

  /** На lg три карточки помещаются без скролла при ≤3 турах — но трек остаётся
   * каруселью на любом количестве, просто стрелки/точки скрыты, когда скроллить некуда. */
  const slideClassName = "min-w-0 shrink-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_calc((100%-2rem)/2)] lg:flex-[0_0_calc((100%-4rem)/3)]";

  // Фейд по краю — только там, где за ним страница фона, а не соседняя карточка
  // (см. урок из reviews-embla.tsx: на мобильном слайды всегда «подглядывают»,
  // фейд поверх выглядывающей карточки даёт цветное пятно вместо чистого края).
  const showLeftFade = canPrev;
  const showRightFade = canNext;

  if (!tours.length) return null;

  return (
    <div>
      <div className="relative">
        {showLeftFade && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-10 bg-gradient-to-r from-background to-transparent lg:block"
            aria-hidden
          />
        )}
        {showRightFade && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-10 bg-gradient-to-l from-background to-transparent lg:block"
            aria-hidden
          />
        )}

        <div className="overflow-x-hidden overflow-y-visible py-2" ref={viewportRef}>
          <div className="flex items-stretch gap-5 pr-1 sm:gap-6 lg:gap-8">
            {tours.map((tour) => (
              <div key={tour._id} className={slideClassName}>
                <TourCalendarCard tour={tour} variant="mobile" />
              </div>
            ))}
          </div>
        </div>

        {!single && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className={cn(arrowClass, arrowHover, "absolute -left-3 top-[35%] z-20 hidden -translate-y-1/2 md:flex", "h-12 w-12 lg:-left-8 lg:h-14 lg:w-14 xl:-left-14")}
              aria-label="Предыдущие туры"
            >
              <ArrowIconLeft />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className={cn(arrowClass, arrowHover, "absolute -right-3 top-[35%] z-20 hidden -translate-y-1/2 md:flex", "h-12 w-12 lg:-right-8 lg:h-14 lg:w-14 xl:-right-14")}
              aria-label="Следующие туры"
            >
              <ArrowIconRight />
            </button>
          </>
        )}
      </div>

      {!single && (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 lg:mt-8">
          <div className="relative h-12 w-full md:hidden">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className={cn(arrowClass, arrowActive, "absolute top-1/2 left-0 z-20 -translate-y-1/2", "h-12 w-12")}
              aria-label="Предыдущие туры"
            >
              <ArrowIconLeft />
            </button>

            <div className="flex h-full items-center justify-center gap-2 px-14">
              {tours.map((tour, i) => (
                <button
                  key={tour._id}
                  type="button"
                  aria-label={`Тур ${i + 1} из ${tours.length}`}
                  aria-current={i === selected ? "true" : undefined}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full transition-all duration-300",
                    i === selected ? "w-8 bg-primary" : "bg-muted hover:bg-primary/50"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className={cn(arrowClass, arrowActive, "absolute top-1/2 right-0 z-20 -translate-y-1/2", "h-12 w-12")}
              aria-label="Следующие туры"
            >
              <ArrowIconRight />
            </button>
          </div>

          <div className="hidden md:flex md:gap-2">
            {tours.map((tour, i) => (
              <button
                key={tour._id}
                type="button"
                aria-label={`Тур ${i + 1} из ${tours.length}`}
                aria-current={i === selected ? "true" : undefined}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full transition-all duration-300",
                  i === selected ? "w-8 bg-primary" : "bg-muted hover:bg-primary/50"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsGridRowAlign } from "@/components/sections/reviews-grid-row-align";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/utils/reviews";

export type ReviewsEmblaVariant = "default" | "full";

interface ReviewsEmblaProps {
  reviews: ReviewItem[];
  /**
   * `default` — узкая карусель (обычно внутри `md:hidden`).
   * `full` — главная при >4 отзывов: как ProgramDaysCarousel (стрелки, точки), 4 карточки в ряд на md+.
   */
  variant?: ReviewsEmblaVariant;
  /**
   * `home` — ширина как на главной (`max-w-screen-xl` + отступы).
   * `tour` — внутри колонки страницы тура (`max-w-4xl` задаётся снаружи, здесь без лишнего px).
   */
  fullLayout?: "home" | "tour";
}

/** Как в ProgramDaysCarousel: круглые кнопки с обводкой #bea692 */
const programArrowClass = cn(
  "flex items-center justify-center rounded-full",
  "border-2 border-[#bea692] bg-transparent shadow-md backdrop-blur-sm",
  "transition-all duration-200",
  "disabled:opacity-30 disabled:cursor-not-allowed"
);

const programArrowHover =
  "hover:bg-[#bea692]/10 hover:shadow-xl hover:scale-110 disabled:hover:scale-100";
const programArrowActive =
  "active:bg-[#bea692]/15 active:shadow-xl active:scale-110 disabled:active:scale-100";

function ArrowIconLeft({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#bea692]", className)}
      aria-hidden
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIconRight({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#bea692]", className)}
      aria-hidden
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReviewsEmbla({
  reviews,
  variant = "default",
  fullLayout = "home",
}: ReviewsEmblaProps) {
  const isFull = variant === "full";
  const isTourLayout = fullLayout === "tour";

  const options = useMemo(
    () =>
      ({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false,
        skipSnaps: false,
        duration: isFull ? 28 : 22,
      }) satisfies EmblaOptionsType,
    [isFull]
  );

  const [viewportRef, embla] = useEmblaCarousel(options);

  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const reviewsKey = useMemo(
    () => reviews.map((r) => r._id).join("|"),
    [reviews]
  );

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
  }, [embla, reviewsKey]);

  const scrollTo = useCallback(
    (i: number) => {
      embla?.scrollTo(i);
    },
    [embla]
  );

  const scrollPrev = useCallback(() => {
    embla?.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    embla?.scrollNext();
  }, [embla]);

  const single = reviews.length <= 1;

  const slideClassName = useMemo(
    () =>
      cn(
        "min-w-0 shrink-0",
        isFull
          ? [
              "flex-[0_0_85%]",
              "sm:flex-[0_0_82%]",
              "md:flex-[0_0_calc((100%-4.5rem)/4)]",
            ]
          : "flex-[0_0_82%]"
      ),
    [isFull]
  );

  /** Затемнение края только если в эту сторону есть ещё контент (не закрашиваем полностью видимый крайний слайд) */
  const showLeftFade = canPrev;
  const showRightFade = canNext;

  const trackInner = (
    <>
      {showLeftFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-[1] bg-gradient-to-r from-background to-transparent",
            isFull ? "w-8 md:w-10" : "w-8"
          )}
          aria-hidden
        />
      )}
      {showRightFade && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-[1] bg-gradient-to-l from-background to-transparent",
            isFull ? "w-8 md:w-10" : "w-8"
          )}
          aria-hidden
        />
      )}

      <div
        className="overflow-x-hidden overflow-y-visible py-2"
        ref={viewportRef}
      >
        <ReviewsGridRowAlign
          alignKey={reviewsKey}
          className={cn(
            "flex items-start pr-1",
            isFull ? "gap-6" : "gap-3 sm:gap-4"
          )}
        >
          {reviews.map((review) => (
            <div key={review._id} className={slideClassName}>
              <ReviewCard review={review} />
            </div>
          ))}
        </ReviewsGridRowAlign>
      </div>
    </>
  );

  const dotsClass = (active: boolean) =>
    cn(
      "h-2 w-2 rounded-full transition-all duration-300",
      active ? "w-8 bg-[#bea692]" : "bg-[#e5e0db] hover:bg-[#bea692]/50"
    );

  const dotsRow = !single && (
    <div className="flex justify-center gap-2">
      {reviews.map((review, i) => (
        <button
          key={review._id}
          type="button"
          aria-label={`Отзыв ${i + 1} из ${reviews.length}`}
          aria-current={i === selected ? "true" : undefined}
          onClick={() => scrollTo(i)}
          className={dotsClass(i === selected)}
        />
      ))}
    </div>
  );

  if (!reviews.length) return null;

  if (!isFull) {
    return (
      <div className="pt-2">
        <div className={cn("relative", "-mx-4 px-4")}>{trackInner}</div>
        {!single && (
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2"
            role="tablist"
            aria-label="Навигация по отзывам"
          >
            {reviews.map((review, i) => (
              <button
                key={review._id}
                type="button"
                role="tab"
                aria-selected={i === selected}
                aria-label={`Отзыв ${i + 1} из ${reviews.length}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bea692]/35",
                  i === selected
                    ? "w-7 bg-[#bea692]"
                    : "w-2 bg-[#e5e0db] hover:bg-[#bea692]/45"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ----- full: как ProgramDaysCarousel; стрелки внутри полосы (не за пределами — иначе режет overflow) ----- */
  return (
    <section className="pt-2 md:pt-4">
      <div
        className={cn(
          "mx-auto w-full",
          isTourLayout
            ? "max-w-full px-0"
            : "max-w-screen-xl px-4 md:px-8"
        )}
      >
        <div className="relative">
          {trackInner}

          {!single && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canPrev}
                className={cn(
                  programArrowClass,
                  programArrowHover,
                  /* Фиксировано от верха полосы: при раскрытии «Читать дальше» не ездит к центру */
                  "absolute left-2 top-16 z-20 hidden md:flex",
                  "h-12 w-12 md:left-3 md:top-20 md:h-14 md:w-14"
                )}
                aria-label="Предыдущие отзывы"
              >
                <ArrowIconLeft />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canNext}
                className={cn(
                  programArrowClass,
                  programArrowHover,
                  "absolute right-2 top-16 z-20 hidden md:flex",
                  "h-12 w-12 md:right-3 md:top-20 md:h-14 md:w-14"
                )}
                aria-label="Следующие отзывы"
              >
                <ArrowIconRight />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Низ: мобильные стрелки + точки; десктоп — только точки — как ProgramDaysCarousel */}
      {!single && (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 md:mt-8">
          <div className="relative h-12 w-full md:hidden">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className={cn(
                programArrowClass,
                programArrowActive,
                "absolute top-1/2 left-0 z-20 -translate-y-1/2",
                "h-12 w-12"
              )}
              aria-label="Предыдущие отзывы"
            >
              <ArrowIconLeft />
            </button>

            <div className="flex h-full items-center justify-center gap-2 px-14">
              {reviews.map((review, i) => (
                <button
                  key={review._id}
                  type="button"
                  aria-label={`Отзыв ${i + 1} из ${reviews.length}`}
                  onClick={() => scrollTo(i)}
                  className={dotsClass(i === selected)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className={cn(
                programArrowClass,
                programArrowActive,
                "absolute top-1/2 right-0 z-20 -translate-y-1/2",
                "h-12 w-12"
              )}
              aria-label="Следующие отзывы"
            >
              <ArrowIconRight />
            </button>
          </div>

          <div className="hidden md:flex">{dotsRow}</div>
        </div>
      )}
    </section>
  );
}

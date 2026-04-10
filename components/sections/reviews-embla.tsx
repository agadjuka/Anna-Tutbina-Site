"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReviewCard } from "@/components/sections/review-card";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/utils/reviews";

interface ReviewsEmblaProps {
  reviews: ReviewItem[];
}

export function ReviewsEmbla({ reviews }: ReviewsEmblaProps) {
  const options = useMemo(
    () =>
      ({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false,
        skipSnaps: false,
        duration: 22,
      }) satisfies EmblaOptionsType,
    []
  );

  const [viewportRef, embla] = useEmblaCarousel(options);

  const [selected, setSelected] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelected(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!embla) return;
    onSelect(embla);
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const scrollTo = useCallback(
    (i: number) => {
      embla?.scrollTo(i);
    },
    [embla]
  );

  const single = reviews.length <= 1;

  const slideStyle = useMemo(
    () =>
      ({
        flex: single ? "0 0 100%" : "0 0 82%",
      }) as React.CSSProperties,
    [single]
  );

  if (!reviews.length) return null;

  return (
    <div className="md:hidden pt-2">
      <div className="relative -mx-4 px-4">
        {/* Мягкое затемнение по краям при горизонтальном скролле */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />

        <div
          className="overflow-x-hidden overflow-y-visible py-2"
          ref={viewportRef}
        >
          <div className="flex items-start gap-3 pr-1 sm:gap-4">
            {reviews.map((review) => (
              <div key={review._id} style={slideStyle}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </div>

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

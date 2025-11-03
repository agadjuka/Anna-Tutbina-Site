"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";

interface ProgramDay {
  dayTitle?: string;
  dayImage?: any[];
  dayDescription?: any;
}

interface ProgramDaysCarouselProps {
  days: ProgramDay[];
}

export function ProgramDaysCarousel({ days }: ProgramDaysCarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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

  if (!days || days.length === 0) return null;

  return (
    <section className="relative">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="overflow-hidden">
            <div ref={viewportRef} className="overflow-hidden">
              <div className="flex">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className="min-w-0 shrink-0 w-full flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8"
                  >
                    {/* Левая часть - фотографии в сетке 2x2 */}
                    <div className="w-full md:w-2/5">
                      {day.dayImage && day.dayImage.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                          {day.dayImage.slice(0, 4).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative overflow-hidden aspect-square bg-gray-100"
                            >
                              <SanityImage
                                image={img}
                                fill
                                className="object-cover"
                                alt={day.dayTitle || `День ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Правая часть - текст */}
                    <div className="w-full md:w-3/5 flex flex-col justify-center space-y-3 md:space-y-4">
                      {day.dayTitle && (
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                          {day.dayTitle}
                        </h3>
                      )}
                      {day.dayDescription && (
                        <div className="prose prose-lg max-w-none">
                          <PortableTextContent
                            value={day.dayDescription}
                            className="text-sm md:text-base leading-relaxed text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Стрелки навигации - вне контентной области */}
      {days.length > 1 && (
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-4xl mx-auto w-full relative h-full">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-auto",
                "w-10 h-10 md:w-12 md:h-12 rounded-full",
                "flex items-center justify-center",
                "bg-white/90 backdrop-blur-sm border border-[#e5e0db]",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-md",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "left-0 -translate-x-full"
              )}
              aria-label="Предыдущий день"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  d="M12 15L7 10L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-auto",
                "w-10 h-10 md:w-12 md:h-12 rounded-full",
                "flex items-center justify-center",
                "bg-white/90 backdrop-blur-sm border border-[#e5e0db]",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-md",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "right-0 translate-x-full"
              )}
              aria-label="Следующий день"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  d="M8 5L13 10L8 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


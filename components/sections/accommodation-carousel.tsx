"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState, useMemo } from "react";
import { PhotoCarousel, NESTED_CAROUSEL_ATTR } from "@/components/sections/photo-carousel";
import { PortableTextContent } from "@/components/ui/portable-text";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";
import { TOUR_BLOCK_WIDTH } from "@/lib/tour-layout";

interface AccommodationLocation {
  locationName?: string;
  locationImages?: any[];
  locationDescription?: any;
}

interface AccommodationCarouselProps {
  locations: AccommodationLocation[];
}

function buildSlides(locations: AccommodationLocation[]) {
  const slides: Array<{ src: string; width: number; height: number; alt: string; locationIndex: number; imageIndex: number }> = [];
  
  locations.forEach((location, locIdx) => {
    if (location.locationImages && location.locationImages.length > 0) {
      location.locationImages.forEach((img, imgIdx) => {
        if (img?.asset) {
          const dims = img.asset?.metadata?.dimensions;
          const width = Math.max(1, Math.floor(dims?.width || 1600));
          const height = Math.max(1, Math.floor(dims?.height || 900));

          slides.push({
            src: urlFor(img).width(Math.min(2000, width)).auto("format").url(),
            width,
            height,
            alt: location.locationName || `Локация ${locIdx + 1} — фото ${imgIdx + 1}`,
            locationIndex: locIdx,
            imageIndex: imgIdx,
          });
        }
      });
    }
  });
  
  return slides;
}

export function AccommodationCarousel({ locations }: AccommodationCarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: false,
    loop: false,
    // Перетаскивание, начатое на фото, принадлежит вложенной карусели фото.
    watchDrag: (_api, evt) => !(evt.target as HTMLElement | null)?.closest?.(`[${NESTED_CAROUSEL_ATTR}]`),
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);

  const slides = useMemo(() => buildSlides(locations), [locations]);

  const findSlideIndex = useCallback((locationIndex: number, imageIndex: number): number => {
    // Считаем только фото с `asset` — так же, как `buildSlides` и `PhotoCarousel`.
    let currentIndex = 0;
    for (let i = 0; i < locationIndex; i++) {
      currentIndex += (locations[i]?.locationImages ?? []).filter((img) => img?.asset).length;
    }
    return currentIndex + imageIndex;
  }, [locations]);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!locations || locations.length === 0) return null;

  return (
    <section className="relative">
      <div className={cn("mx-auto", TOUR_BLOCK_WIDTH)}>
        <div className="relative overflow-hidden">
          <div ref={viewportRef} className="overflow-hidden" style={{ clipPath: 'inset(0)' }}>
            <div className="flex gap-4 md:gap-6 lg:gap-[calc(25.6*var(--ona-u))]">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 flex-shrink-0"
                  style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}
                >
                    <div className="relative">
                      {/* Заголовок над фотографиями */}
                      {location.locationName && (
                        <div className="mb-4 md:mb-6 pt-0 lg:mb-[calc(19.2*var(--ona-u))]">
                          <div className="relative inline-block">
                            {/* Без `tracking-tight`: на 30px это −0.75px на букву,
                                и названия локаций «плыли» — то самое замечание
                                заказчика, из-за которого глобальный `tracking-tight`
                                сняли с заголовков в globals.css. Здесь он пережил ту
                                правку и остался единственным местом на странице тура,
                                где заголовок набран теснее соседних (заголовки дней
                                прямо над ним — с нормальным трекингом). */}
                            <h3 className="text-[22px] md:text-[26px] lg:text-[calc(23.3*var(--ona-u))] lg:leading-[calc(27.96*var(--ona-u))] font-normal text-foreground leading-tight">
                              {location.locationName}
                            </h3>
                            <div className="absolute -bottom-2 left-0 right-0 h-1 lg:-bottom-[calc(6.4*var(--ona-u))] lg:h-[calc(3.2*var(--ona-u))] bg-gradient-to-r from-primary via-primary/60 to-transparent rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {/* Фотографии — вложенная карусель: свайп, стрелки, точки. */}
                      {location.locationImages?.some((img) => img?.asset) ? (
                        <PhotoCarousel
                          images={location.locationImages}
                          alt={location.locationName || `Локация ${index + 1}`}
                          aspectRatio={3 / 2}
                          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 72vw, 60vw"
                          onOpen={(imgIdx) => setLightboxIndex(findSlideIndex(index, imgIdx))}
                          className="mb-4 md:mb-6 lg:mb-[calc(19.2*var(--ona-u))]"
                        />
                      ) : null}

                      {/* Описание снизу */}
                      {location.locationDescription && (
                        <div className="relative">
                          {/* Декоративная линия слева */}
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-full"></div>
                          
                          {/* Текстовое содержимое */}
                          <div className="pl-6 md:pl-8 pt-4 pb-4 md:pt-5 md:pb-5 lg:py-[calc(16*var(--ona-u))] lg:pl-[calc(25.6*var(--ona-u))]">
                            <div className="prose prose-lg max-w-none">
                              <PortableTextContent
                                value={location.locationDescription}
                                className="text-base md:text-lg lg:text-[calc(12.9*var(--ona-u))] lg:leading-[calc(20.6*var(--ona-u))] leading-relaxed text-muted-foreground"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Стрелки навигации - вне контентной области (только для десктопа) */}
      {locations.length > 1 && (
        <div className="hidden md:flex absolute inset-0 items-center pointer-events-none">
          <div className={cn("mx-auto w-full relative h-full", TOUR_BLOCK_WIDTH)}>
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-auto",
                "w-12 h-12 md:w-14 md:h-14 rounded-full lg:size-[calc(44.8*var(--ona-u))]",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-primary",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-xl hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "left-0 -translate-x-full -ml-4 md:-ml-6 lg:-ml-[calc(19.2*var(--ona-u))]"
              )}
              aria-label="Предыдущая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary lg:size-[calc(19.2*var(--ona-u))]"
              >
                <path
                  d="M15 18L9 12L15 6"
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
                "w-12 h-12 md:w-14 md:h-14 rounded-full lg:size-[calc(44.8*var(--ona-u))]",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-primary",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-xl hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "right-0 translate-x-full -mr-4 md:-mr-6 lg:-mr-[calc(19.2*var(--ona-u))]"
              )}
              aria-label="Следующая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary lg:size-[calc(19.2*var(--ona-u))]"
              >
                <path
                  d="M9 18L15 12L9 6"
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

      {/* Индикаторы точек (dots) и мобильные кнопки навигации */}
      {locations.length > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:mt-6 lg:mt-[calc(19.2*var(--ona-u))]">
          {/* Мобильные кнопки навигации */}
          <div className="relative md:hidden w-full h-12">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2",
                "w-12 h-12 rounded-full",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-primary",
                "transition-all duration-200",
                "active:bg-white active:shadow-xl active:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
              )}
              aria-label="Предыдущая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary lg:size-[calc(19.2*var(--ona-u))]"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex justify-center gap-2 px-14 h-full items-center">
              {locations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => embla?.scrollTo(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    selectedIndex === idx
                      ? "bg-primary w-8"
                      : "bg-muted active:bg-primary/50"
                  )}
                  aria-label={`Перейти к локации ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2",
                "w-12 h-12 rounded-full",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-primary",
                "transition-all duration-200",
                "active:bg-white active:shadow-xl active:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
              )}
              aria-label="Следующая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary lg:size-[calc(19.2*var(--ona-u))]"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Индикаторы для десктопа */}
          <div className="hidden md:flex justify-center gap-2 lg:gap-[calc(6.4*var(--ona-u))]">
            {locations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => embla?.scrollTo(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 lg:h-[calc(6.4*var(--ona-u))] lg:w-[calc(6.4*var(--ona-u))]",
                  selectedIndex === idx
                    ? "bg-primary w-8 lg:w-[calc(25.6*var(--ona-u))]"
                    : "bg-muted hover:bg-primary/50"
                )}
                aria-label={`Перейти к локации ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {mounted && (
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides.map(s => ({ src: s.src, width: s.width, height: s.height, alt: s.alt }))}
          styles={{
            container: {
              backgroundColor: "rgba(10,10,12,0.40)",
              backdropFilter: "blur(12px) saturate(120%)",
              WebkitBackdropFilter: "blur(12px) saturate(120%)",
            },
            button: {
              boxShadow: "none",
              filter: "none",
              textShadow: "none",
            },
          }}
          animation={{ fade: 0, swipe: 300 }}
        />
      )}
    </section>
  );
}
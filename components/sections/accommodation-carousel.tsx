"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState, useMemo } from "react";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from "@/lib/sanity.client";

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
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const slides = useMemo(() => buildSlides(locations), [locations]);

  const findSlideIndex = useCallback((locationIndex: number, imageIndex: number): number => {
    let currentIndex = 0;
    for (let i = 0; i < locationIndex; i++) {
      if (locations[i]?.locationImages) {
        currentIndex += locations[i].locationImages.length;
      }
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

  if (!locations || locations.length === 0) return null;

  return (
    <section className="relative">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden">
          <div ref={viewportRef} className="overflow-hidden" style={{ clipPath: 'inset(0)' }}>
            <div className="flex gap-4 md:gap-6 lg:gap-8">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 flex-shrink-0"
                  style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}
                >
                    <div className="relative">
                      {/* Заголовок над фотографиями */}
                      {location.locationName && (
                        <div className="mb-4 md:mb-6 pt-0">
                          <div className="relative inline-block">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                              {location.locationName}
                            </h3>
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#bea692] via-[#bea692]/60 to-transparent rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {/* Фотографии в сетке 2x2 - главный элемент */}
                      {location.locationImages && location.locationImages.length > 0 ? (() => {
                        // Вычисляем среднее соотношение сторон для всех изображений в локации
                        const imagesToShow = location.locationImages.slice(0, 4);
                        const aspectRatios = imagesToShow
                          .map(img => {
                            const dims = img?.asset?.metadata?.dimensions;
                            return dims?.aspectRatio || (dims?.width && dims?.height ? dims.width / dims.height : 1);
                          })
                          .filter(ar => ar > 0);
                        
                        const averageAspectRatio = aspectRatios.length > 0
                          ? aspectRatios.reduce((sum, ar) => sum + ar, 0) / aspectRatios.length
                          : 1;

                        return (
                          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6">
                            {imagesToShow.map((img, imgIdx) => {
                              const slideIndex = findSlideIndex(index, imgIdx);
                              const dims = img?.asset?.metadata?.dimensions;
                              
                              return (
                                <button
                                  key={imgIdx}
                                  type="button"
                                  onClick={() => setLightboxIndex(slideIndex)}
                                  className={cn(
                                    "group relative overflow-hidden",
                                    "bg-gray-100 cursor-pointer transition-all duration-300",
                                    "hover:scale-[1.02]"
                                  )}
                                  style={{ aspectRatio: averageAspectRatio }}
                                >
                                  <SanityImage
                                    image={img}
                                    width={dims?.width || 1200}
                                    height={dims?.height || 800}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    alt={location.locationName || `Локация ${index + 1}`}
                                  />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                                  <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white drop-shadow-lg"
                                  >
                                    <path
                                      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </button>
                            );
                          })}
                          </div>
                        );
                      })() : null}

                      {/* Описание снизу */}
                      {location.locationDescription && (
                        <div className="relative">
                          {/* Декоративная линия слева */}
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#bea692] via-[#bea692]/60 to-transparent rounded-full"></div>
                          
                          {/* Текстовое содержимое */}
                          <div className="pl-6 md:pl-8 pt-4 pb-4 md:pt-5 md:pb-5">
                            <div className="prose prose-lg max-w-none">
                              <PortableTextContent
                                value={location.locationDescription}
                                className="text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground"
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

      {/* Стрелки навигации - вне контентной области */}
      {locations.length > 1 && (
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-4xl mx-auto w-full relative h-full">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-auto",
                "w-12 h-12 md:w-14 md:h-14 rounded-full",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-[#bea692]",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-xl hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "left-0 -translate-x-full -ml-4 md:-ml-6"
              )}
              aria-label="Предыдущая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#bea692]"
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
                "w-12 h-12 md:w-14 md:h-14 rounded-full",
                "flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm border-2 border-[#bea692]",
                "transition-all duration-200",
                "hover:bg-white hover:shadow-xl hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "right-0 translate-x-full -mr-4 md:-mr-6"
              )}
              aria-label="Следующая локация"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#bea692]"
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

      {/* Индикаторы точек (dots) */}
      {locations.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:mt-6">
          {locations.map((_, idx) => (
            <button
              key={idx}
              onClick={() => embla?.scrollTo(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                selectedIndex === idx
                  ? "bg-[#bea692] w-8"
                  : "bg-[#e5e0db] hover:bg-[#bea692]/50"
              )}
              aria-label={`Перейти к локации ${idx + 1}`}
            />
          ))}
        </div>
      )}

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
    </section>
  );
}
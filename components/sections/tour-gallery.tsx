"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from "@/lib/sanity.client";
import { Heading } from "@/components/ui/heading";

interface TourGalleryProps {
  title?: string;
  images: any[]; // Sanity image objects with asset.metadata.dimensions
  tourName?: string;
}

function buildSlides(images: any[], tourName?: string) {
  return images
    .filter((img) => img?.asset)
    .map((img, idx) => {
      const dims = img.asset?.metadata?.dimensions;
      const width = Math.max(1, Math.floor(dims?.width || 1600));
      const height = Math.max(1, Math.floor(dims?.height || 900));

      return {
        src: urlFor(img).width(Math.min(2000, width)).auto("format").url(),
        width,
        height,
        alt: `${tourName || "Фото"} — ${idx + 1}`,
      };
    });
}

export function TourGallery({ title = "Галерея", images, tourName }: TourGalleryProps) {
  const slides = buildSlides(images, tourName);
  const [index, setIndex] = useState<number>(-1);

  if (!slides.length) return null;

  return (
    <section className="space-y-6">
      <Heading as="h2" className="mb-0">{title}</Heading>

      {/* Карусель на мобильных */}
      <MobileGalleryCarousel slides={slides} onOpen={(i) => setIndex(i)} />

      {/* Колонки начиная с md */}
      <div className="hidden md:block [&>figure]:mb-5 lg:[&>figure]:mb-6 md:columns-2 lg:columns-3 md:gap-5 lg:gap-6">
        {slides.map((slide, i) => (
          <figure key={i} className="break-inside-avoid overflow-hidden bg-white cursor-zoom-in shadow-card hover:shadow-card-hover" onClick={() => setIndex(i)}>
            <img
              src={slide.src}
              alt={slide.alt}
              loading="lazy"
              className="block w-full h-auto object-contain"
            />
          </figure>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        styles={{
          // Делаем фон лайтбокса прозрачным. Фон с блюром добавим отдельным оверлеем ниже,
          // чтобы контролировать задержку появления затемнения.
          container: { backgroundColor: "transparent" },
        }}
      />
      {index >= 0 && (
        <div className="lightbox-backdrop" aria-hidden="true" />
      )}
    </section>
  );
}


function MobileGalleryCarousel({ slides, onOpen }: { slides: { src: string; alt?: string; width?: number; height?: number }[]; onOpen: (i: number) => void }) {
  const options = { align: "center", containScroll: "trimSnaps", dragFree: false } as const;
  const [viewportRef] = useEmblaCarousel(options);
  const heightPx = 240; // фиксированная высота

  return (
    <div className="md:hidden -mx-4 px-4">
      <div className="overflow-x-hidden" ref={viewportRef}>
        <div className="flex gap-4 py-2">
          {slides.map((s, i) => {
            // Вычисляем aspect-ratio для чистого изображения
            const ratio = s.width && s.height ? `${s.width}/${s.height}` : undefined;
            return (
              <div
                key={i}
                className="shrink-0"
                style={{
                  height: `${heightPx}px`,
                  aspectRatio: ratio,
                  flex: "0 0 auto",
                  maxWidth: "80%",
                }}
              >
                <button type="button" className="w-full h-full cursor-zoom-in" onClick={() => onOpen(i)}>
                  <img src={s.src} alt={s.alt || "Фото"} className="w-full h-full object-contain" loading="lazy" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { SanityImage } from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";

/** Атрибут-метка: внешняя карусель по нему не перехватывает перетаскивание,
 * начатое на фото (см. `watchDrag` в `accommodation-carousel.tsx`). */
export const NESTED_CAROUSEL_ATTR = "data-nested-carousel";

interface PhotoCarouselProps {
  images: any[];
  alt: string;
  /** Пропорция кадра (ширина / высота) — одна на все фото, чтобы карусель не прыгала по высоте. */
  aspectRatio?: number;
  /** `sizes` для next/image: реальная ширина кадра на экране. */
  sizes?: string;
  /** Клик по фото — открыть лайтбокс на этом снимке. */
  onOpen?: (index: number) => void;
  className?: string;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 text-primary lg:size-[calc(19.2*var(--ona-u))]">
      <path
        d={dir === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const arrowClass = cn(
  "absolute top-1/2 z-10 -translate-y-1/2 flex items-center justify-center rounded-full",
  "size-10 lg:size-[calc(40*var(--ona-u))]",
  "border-2 border-primary bg-white/90 shadow-md backdrop-blur-sm",
  "transition-all duration-200 hover:bg-white hover:scale-110",
  "active:scale-100 disabled:cursor-not-allowed disabled:opacity-0 disabled:pointer-events-none"
);

/**
 * Карусель фотографий одного блока (размещение и т.п.): свайп + стрелки поверх
 * кадра + точки. Одно фото — просто кадр без управления.
 */
export function PhotoCarousel({ images, alt, aspectRatio = 3 / 2, sizes = "(max-width: 1023px) 100vw, 60vw", onOpen, className }: PhotoCarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback((api: EmblaCarouselType) => {
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!embla) return;
    sync(embla);
    embla.on("select", sync);
    embla.on("reInit", sync);
    return () => {
      embla.off("select", sync);
      embla.off("reInit", sync);
    };
  }, [embla, sync]);

  const list = images.filter((img) => img?.asset);
  if (list.length === 0) return null;
  const multi = list.length > 1;

  return (
    <div className={cn("relative", className)}>
      <div ref={viewportRef} className="overflow-hidden" {...{ [NESTED_CAROUSEL_ATTR]: "" }}>
        <div className="flex touch-pan-y">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onOpen?.(i)}
              className="relative min-w-0 shrink-0 grow-0 basis-full cursor-pointer overflow-hidden bg-gray-100"
              style={{ aspectRatio }}
              aria-label={`${alt} — фото ${i + 1} из ${list.length}`}
            >
              <SanityImage
                image={img}
                fill
                aspectRatio={aspectRatio}
                sizes={sizes}
                className="object-cover"
                alt={`${alt} — фото ${i + 1}`}
              />
            </button>
          ))}
        </div>
      </div>

      {multi && (
        <>
          <button
            type="button"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev}
            className={cn(arrowClass, "left-2 lg:left-[calc(12*var(--ona-u))]")}
            aria-label="Предыдущее фото"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext}
            className={cn(arrowClass, "right-2 lg:right-[calc(12*var(--ona-u))]")}
            aria-label="Следующее фото"
          >
            <Chevron dir="right" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5 lg:bottom-[calc(10*var(--ona-u))]">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={`Фото ${i + 1}`}
                aria-current={i === selected ? "true" : undefined}
                className={cn(
                  "pointer-events-auto h-2 rounded-full transition-all duration-300",
                  i === selected ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from "@/lib/sanity.client";
import { SectionHeading } from "@/components/ui/section-heading";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    function onResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Параметры
  const rowHeight = 320; // фиксированная высота строки
  const gap = 8; // между фото
  const minRowImages = 2;
  const maxRowImages = 5;
  // Разделение на строки (максимально pack)
  const rows = useMemo(() => {
    if (!containerWidth || slides.length === 0) return [];
    const out: Array<{ photos: typeof slides; scaledHeights: number[]; widths: number[]; }> = [];
    let curr: any[] = [];
    let i = 0;
    while (i < slides.length) {
      curr.push(slides[i]);
      // сколько брать в строку
      // считаем желаемую сумму ширин при h = rowHeight
      let sumWidth = 0;
      for (const s of curr) {
        sumWidth += (s.width / s.height) * rowHeight;
      }
      const totalGaps = (curr.length - 1) * gap;
      // если плотная строка
      if ((sumWidth + totalGaps > containerWidth && curr.length >= minRowImages) || curr.length >= maxRowImages) {
        // масштабируем ширину до контейнера
        const scale = (containerWidth - totalGaps) / sumWidth;
        const scaledHeights = curr.map(() => rowHeight);
        const widths = curr.map(s => Math.round((s.width / s.height) * rowHeight * scale));
        out.push({ photos: curr, scaledHeights, widths });
        curr = [];
      }
      i++;
    }
    // Остатки — последней строкой, не растягивать
    if (curr.length) {
      const scaledHeights = curr.map(() => rowHeight);
      const widths = curr.map(s => Math.round((s.width / s.height) * rowHeight));
      out.push({ photos: curr, scaledHeights, widths });
    }
    return out;
  }, [containerWidth, slides, rowHeight, gap, minRowImages, maxRowImages]);

  if (!slides.length) return null;

  return (
    <section id="gallery" className="space-y-6">
      <div className="relative">
        <SectionHeading as="h2" className="mb-4">
          {title}
        </SectionHeading>
      </div>

      <div className="w-full flex justify-center">
        <div className="max-w-4xl w-full">
          <MobileGalleryCarousel slides={slides} onOpen={(i) => setIndex(i)} />

          {/* Justified строковая галерея на desktop */}
          <div ref={containerRef} className="hidden md:block w-full">
            <div className="flex flex-col gap-y-[12px]">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-row" style={{ gap }}>
                  {row.photos.map((s, i) => (
                    <img
                      key={i}
                      src={s.src}
                      alt={s.alt}
                      loading="lazy"
                      style={{ height: `${row.scaledHeights[i]}px`, width: `${row.widths[i]}px`, objectFit: "cover", cursor: "pointer", display: "block" }}
                      onClick={() => {
                        // Складываем количество фото до этой строки + индекс
                        const idx = rows.slice(0, rowIdx).reduce((a, r) => a + r.photos.length, 0) + i;
                        setIndex(idx);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
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


function MobileGalleryCarousel({ slides, onOpen }: { slides: { src: string; alt?: string; width?: number; height?: number }[]; onOpen: (i: number) => void }) {
  const options = { align: "center", containScroll: "trimSnaps", dragFree: false } as const;
  const [viewportRef] = useEmblaCarousel(options);
  const heightPx = 240; // фиксированная высота

  return (
    <div className="md:hidden -mx-4 px-4">
      <div className="overflow-x-hidden" ref={viewportRef}>
        <div className="flex gap-4 py-2">
          {slides.map((s, i) => {
            return (
              <div
                key={i}
                className="shrink-0"
                style={{
                  height: `${heightPx}px`,
                  flex: "0 0 auto",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <button type="button" className="h-full cursor-zoom-in" onClick={() => onOpen(i)}>
                  <img
                    src={s.src}
                    alt={s.alt || "Фото"}
                    loading="lazy"
                    style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



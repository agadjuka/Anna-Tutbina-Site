"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  title?: string;
  images: any[]; // Sanity image objects
  className?: string;
}

// Адаптивная «masonry»‑сетка на CSS Columns без кропа изображений
export function GallerySection({ title = "Галерея", images, className }: GallerySectionProps) {
  return (
    <section id="gallery" className={cn("py-10 md:py-12 lg:py-16 bg-background", className)}>
      <Container>
        <div className="space-y-6 md:space-y-8">
          <SectionHeading as="h2">{title}</SectionHeading>

          <div className="[&>figure]:mb-6 columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 lg:gap-6">
            {images.map((image, idx) => {
              if (!image?.asset) return null;
              const src = urlFor(image).width(1200).auto("format").url();
              return (
                <figure key={idx} className="break-inside-avoid overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 bg-white">
                  {/* Полное изображение без обрезки: ширина 100%, высота авто */}
                  <img
                    src={src}
                    alt={image?.alt || "Фото"}
                    className="block w-full h-auto object-contain"
                    loading="lazy"
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}



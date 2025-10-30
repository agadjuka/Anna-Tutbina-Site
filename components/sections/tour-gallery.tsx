"use client";

import { useState } from "react";
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
      <div className="[&>figure]:mb-4 sm:[&>figure]:mb-5 lg:[&>figure]:mb-6 columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 lg:gap-6">
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
      />
    </section>
  );
}



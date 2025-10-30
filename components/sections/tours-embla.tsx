"use client";

import useEmblaCarousel, { type EmblaOptionsType, type EmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TourCard } from "./tour-card";
import { cn } from "@/lib/utils";

interface Price { value: number; currency: string }
interface Tour {
  _id: string;
  name: string;
  slug: { current: string };
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: Price;
}

interface ToursEmblaProps { tours: Tour[] }

export function ToursEmbla({ tours }: ToursEmblaProps) {
  const options: EmblaOptionsType = {
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    inViewThreshold: 0.25,
  };

  const [viewportRef, embla] = useEmblaCarousel(options);
  const [active, setActive] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setActive(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", () => onSelect(embla));
    embla.on("settle", () => onSelect(embla));
    onSelect(embla);
  }, [embla, onSelect]);

  // Ширина 80vw, макс 400
  const slideStyle = useMemo(() => ({ flex: "0 0 80%", maxWidth: 400 } as React.CSSProperties), []);

  return (
    <div className="md:hidden pt-6 -mx-4 px-4">
      <div className="overflow-hidden" ref={viewportRef}>
        <div className={cn("flex gap-6")}> 
          {tours.map((t, i) => (
            <div key={t._id} style={slideStyle}>
              <TourCard tour={t} isActive={i === active} className="[&>div]:!aspect-[4/5]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



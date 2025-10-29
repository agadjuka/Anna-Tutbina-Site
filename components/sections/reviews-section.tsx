"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Heading } from "@/components/ui/heading";
import { ReviewCard } from "@/components/sections/review-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!reviews?.length) return null;

  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <Heading as="h2">Что говорят наши участницы</Heading>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 flex items-center justify-center transition-colors"
            aria-label="Назад"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 flex items-center justify-center transition-colors"
            aria-label="Вперёд"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-8 flex">
          {reviews.map((review) => (
            <div key={review._id} className="min-w-0 shrink-0 grow-0 basis-full pl-8 md:basis-1/2 lg:basis-1/3">
              <div className="h-[300px]">
                <ReviewCard review={review} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Heading } from "@/components/ui/heading";
import { ReviewCard } from "@/components/sections/review-card";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <section className="relative py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#bea692]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#e5e0db]/5 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Декоративная линия слева */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#bea692]/30 to-transparent hidden lg:block" />
        
        <div className="mb-8 md:mb-10 lg:mb-12 relative">
          {/* Заголовок секции по центру */}
          <div className="mb-6 md:mb-8 relative">
            <SectionHeading as="h2">
              Что говорят наши участницы
            </SectionHeading>
            
            {/* Кнопки навигации - абсолютное позиционирование справа на десктопе */}
            <div className="flex items-center justify-center gap-3 mt-6 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="group h-14 w-14 rounded-full border-2 border-[#e5e0db] bg-white text-muted-foreground hover:text-foreground hover:bg-[#bea692] hover:border-[#bea692] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e5e0db] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Назад"
              >
                <ChevronLeft className="h-5 w-5 group-hover:text-white transition-colors" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="group h-14 w-14 rounded-full border-2 border-[#e5e0db] bg-white text-muted-foreground hover:text-foreground hover:bg-[#bea692] hover:border-[#bea692] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e5e0db] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Вперёд"
              >
                <ChevronRight className="h-5 w-5 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Карусель с улучшенным отображением */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 md:-ml-8 flex">
            {reviews.map((review, index) => (
              <div 
                key={review._id} 
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[70%] pl-6 md:basis-1/2 md:pl-8 lg:basis-1/3"
              >
                <div className="h-auto min-h-[320px] md:min-h-[360px]">
                  <ReviewCard review={review} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



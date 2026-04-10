"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useMemo } from "react";
import { ReviewCard } from "@/components/sections/review-card";
import type { ReviewItem } from "@/lib/utils/reviews";

interface ReviewsEmblaProps {
  reviews: ReviewItem[];
}

export function ReviewsEmbla({ reviews }: ReviewsEmblaProps) {
  const options: EmblaOptionsType = {
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: true,
  };

  const [viewportRef] = useEmblaCarousel(options);

  // 60% ширины экрана, узкие вертикальные карточки (высота — по контенту, в т.ч. после «Читать дальше»)
  const slideStyle = useMemo(
    () => ({ flex: "0 0 60%" } as React.CSSProperties),
    []
  );

  return (
    <div className="md:hidden pt-2 -mx-4 px-4">
      <div className="overflow-x-hidden overflow-y-visible py-2" ref={viewportRef}>
        <div className="flex items-start gap-4">
          {reviews.map((review) => (
            <div key={review._id} style={slideStyle}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



"use client";

import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReviewCard } from "@/components/sections/review-card";

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

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

  // Динамическое выравнивание высоты по максимальной карточке
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!cardRefs.current.length) return;
    const nodes = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const measure = () => {
      const h = nodes.reduce((m, el) => Math.max(m, el.offsetHeight), 0);
      setMaxHeight(h || undefined);
    };

    // Наблюдаем за изменениями размера, чтобы корректно реагировать на переносы текста/шрифты/изображения
    const ro = new ResizeObserver(() => measure());
    nodes.forEach((n) => ro.observe(n));
    measure();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [reviews.length]);

  // 60% ширины экрана, узкие вертикальные карточки
  const slideStyle = useMemo(
    () => ({ flex: "0 0 60%" } as React.CSSProperties),
    []
  );

  return (
    <div className="md:hidden pt-2 -mx-4 px-4">
      <div className="overflow-x-hidden overflow-y-visible py-2" ref={viewportRef}>
        <div className="flex gap-4">
          {reviews.map((review, idx) => (
            <div key={review._id} style={slideStyle}>
              {/* Высота выравнивается по максимальной среди карточек */}
              <div
                ref={(el) => (cardRefs.current[idx] = el)}
                style={maxHeight ? { height: maxHeight } : undefined}
                className={maxHeight ? "h-full" : ""}
              >
                <ReviewCard review={review} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



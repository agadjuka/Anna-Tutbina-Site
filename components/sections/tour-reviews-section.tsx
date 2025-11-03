import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsEmbla } from "@/components/sections/reviews-embla";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

interface TourReviewsSectionProps {
  reviews: ReviewItem[];
}

export function TourReviewsSection({ reviews }: TourReviewsSectionProps) {
  if (!reviews?.length) return null;

  // Определяем количество колонок в зависимости от количества отзывов
  const getGridCols = (count: number) => {
    if (count === 1) return "md:grid-cols-1";
    if (count === 2) return "md:grid-cols-2";
    if (count === 3) return "md:grid-cols-3";
    return "md:grid-cols-2 lg:grid-cols-4";
  };

  // Определяем максимальную ширину контейнера для 1 отзыва
  const getContainerWidth = (count: number) => {
    if (count === 1) return "max-w-md";
    return "max-w-4xl";
  };

  return (
    <section id="reviews" className="space-y-6">
      <div className="relative">
        <SectionHeading as="h2" className="mb-6 md:mb-8">
          Что говорят наши участницы
        </SectionHeading>
      </div>

      {/* Мобильная горизонтальная карусель - все отзывы */}
      <div className="md:hidden">
        <ReviewsEmbla reviews={reviews} />
      </div>

      {/* Десктопная сетка с динамической шириной */}
      <div className="w-full flex justify-center">
        <div className={cn(
          "hidden md:grid gap-4 md:gap-6 items-stretch w-full",
          getGridCols(reviews.length),
          getContainerWidth(reviews.length)
        )}>
          {reviews.map((review) => (
            <div key={review._id} className="flex">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsGridRowAlign } from "@/components/sections/reviews-grid-row-align";
import { ReviewsCollapseBar } from "@/components/sections/reviews-collapse-bar";
import { ReviewsExpandProvider } from "@/components/sections/reviews-expand-context";
import { ReviewsEmbla } from "@/components/sections/reviews-embla";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ReviewItem } from "@/lib/utils/reviews";

interface TourReviewsSectionProps {
  reviews: ReviewItem[];
}

/**
 * Та же логика, что на главной (карусель при >4), но ширина контента как у «Что нас ждет» — max-w-4xl.
 */
export function TourReviewsSection({ reviews }: TourReviewsSectionProps) {
  if (!reviews?.length) return null;

  const useFullCarousel = reviews.length > 4;

  return (
    <section id="reviews" className="space-y-6">
      <ReviewsExpandProvider>
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative">
            <SectionHeading as="h2" className="mb-6 md:mb-8">
              Что говорят наши участницы
            </SectionHeading>
          </div>

          {useFullCarousel ? (
            <ReviewsEmbla
              variant="full"
              fullLayout="tour"
              reviews={reviews}
            />
          ) : (
            <>
              <div className="md:hidden">
                <ReviewsEmbla fullLayout="tour" reviews={reviews} />
              </div>
              <ReviewsGridRowAlign
                alignKey={reviews.map((r) => r._id).join("|")}
                className="hidden grid-cols-1 items-stretch gap-4 md:grid sm:grid-cols-2 lg:grid-cols-4 md:gap-6"
              >
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </ReviewsGridRowAlign>
            </>
          )}

          <ReviewsCollapseBar />
        </div>
      </ReviewsExpandProvider>
    </section>
  );
}

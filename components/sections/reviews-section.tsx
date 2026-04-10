import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsGridRowAlign } from "@/components/sections/reviews-grid-row-align";
import { ReviewsCollapseBar } from "@/components/sections/reviews-collapse-bar";
import { ReviewsExpandProvider } from "@/components/sections/reviews-expand-context";
import { ReviewsEmbla } from "@/components/sections/reviews-embla";
import { SectionHeading } from "@/components/ui/section-heading";
import { shuffleReviews, type ReviewItem } from "@/lib/utils/reviews";

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews?.length) return null;

  const shuffledReviews = shuffleReviews(reviews);
  const useFullCarousel = reviews.length > 4;
  /** 1–3 карточки: делим ширину поровну; 4 — прежняя сетка 2×2 / 4 колонки */
  const equalWidthRow = shuffledReviews.length > 0 && shuffledReviews.length < 4;

  return (
    <section className="relative bg-background pt-4 pb-6 md:pt-6 md:pb-8">
      <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-[#bea692]/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-[#e5e0db]/5 blur-3xl" />

      <ReviewsExpandProvider>
        <div className="relative">
          <div className="absolute bottom-0 top-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-[#bea692]/30 to-transparent lg:block" />

          <div className="relative mb-3 md:mb-4">
            <SectionHeading as="h2">Что говорят наши участницы</SectionHeading>
          </div>

          {useFullCarousel ? (
            <ReviewsEmbla variant="full" reviews={shuffledReviews} />
          ) : (
            <>
              <div className="md:hidden">
                <ReviewsEmbla reviews={shuffledReviews} />
              </div>
              <ReviewsGridRowAlign
                alignKey={shuffledReviews.map((r) => r._id).join("|")}
                className={
                  equalWidthRow
                    ? "hidden md:flex md:flex-row md:items-stretch md:gap-6"
                    : "hidden grid-cols-1 items-stretch gap-4 md:grid sm:grid-cols-2 lg:grid-cols-4 md:gap-6"
                }
              >
                {shuffledReviews.map((review) =>
                  equalWidthRow ? (
                    <div
                      key={review._id}
                      className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col"
                    >
                      <ReviewCard review={review} />
                    </div>
                  ) : (
                    <ReviewCard key={review._id} review={review} />
                  )
                )}
              </ReviewsGridRowAlign>
            </>
          )}

          <ReviewsCollapseBar />
        </div>
      </ReviewsExpandProvider>
    </section>
  );
}

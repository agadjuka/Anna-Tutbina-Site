import { ExpandableReviewText } from "@/components/sections/expandable-review-text";
import { Paragraph } from "@/components/ui/paragraph";
import { SanityImage } from "@/components/ui/sanity-image";
import { reviewCardTextWrapClass } from "@/lib/review-card-text";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/utils/reviews";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      data-review-card
      className="group relative flex h-full min-w-0 w-full max-w-full flex-col rounded-[26px] bg-on-primary px-5 pt-4 pb-4 transition-shadow duration-300 hover:shadow-lg md:px-6 md:pt-5 md:pb-5"
    >
      {/* Шапка: высота по ряду синхронизируется ReviewsGridRowAlign (сетка и карусель) */}
      <div
        data-review-header
        className="relative z-10 flex min-h-0 min-w-0 flex-col justify-start border-b border-border/60 pb-3 box-border"
      >
        <div className="flex w-full min-w-0 items-start gap-3">
          <div className="relative shrink-0 self-start">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-primary/20 md:h-12 md:w-12">
              <SanityImage
                image={review.authorImage}
                width={56}
                height={56}
                alt={review.authorName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-0.5">
            <Paragraph
              className={cn(
                "mb-0 text-sm font-semibold text-foreground md:text-base",
                reviewCardTextWrapClass
              )}
            >
              {review.authorName}
            </Paragraph>
            {review.profession?.trim() ? (
              <p
                className={cn(
                  "mb-0 text-xs italic leading-snug text-muted-foreground md:text-sm",
                  reviewCardTextWrapClass
                )}
              >
                {review.profession.trim()}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col pt-3 md:pt-4">
        <ExpandableReviewText text={review.text} />
      </div>
    </div>
  );
}



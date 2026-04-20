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
      className="group relative flex h-full min-w-0 w-full max-w-full flex-col rounded-2xl border border-border bg-white px-4 pt-3 pb-3 shadow-card transition-all duration-500 hover:border-primary/30 hover:shadow-card-hover md:px-5 md:pt-4 md:pb-4"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-2xl bg-gradient-to-bl from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute top-3 -left-2 h-16 w-1 rounded-full bg-gradient-to-b from-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Шапка: высота по ряду синхронизируется ReviewsGridRowAlign (сетка и карусель) */}
      <div
        data-review-header
        className="relative z-10 flex min-h-0 min-w-0 flex-col justify-start border-b border-border pb-3 box-border"
      >
        <div className="absolute -bottom-1 left-0 h-3 w-3 rounded-full bg-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex w-full min-w-0 items-start gap-3">
          <div className="relative shrink-0 self-start">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-muted/30 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-border transition-all duration-300 group-hover:ring-primary/30 md:h-12 md:w-12">
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



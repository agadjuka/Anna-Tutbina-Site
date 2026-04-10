import { ExpandableReviewText } from "@/components/sections/expandable-review-text";
import { Paragraph } from "@/components/ui/paragraph";
import { SanityImage } from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/utils/reviews";

/** Как у имени: все строки профессии с одного отступа (аватар + gap-3) */
const professionIndent =
  "pl-[calc(2.5rem+0.75rem)] md:pl-[calc(3rem+0.75rem)]";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      data-review-card
      className="group relative flex h-full w-full flex-col rounded-2xl border border-[#e5e0db] bg-white px-6 pt-4 pb-4 shadow-card transition-all duration-500 hover:border-[#bea692]/30 hover:shadow-card-hover md:px-8 md:pt-5 md:pb-5"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-2xl bg-gradient-to-bl from-[#bea692]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute top-4 -left-2 h-16 w-1 rounded-full bg-gradient-to-b from-[#bea692] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Шапка: высота по ряду синхронизируется ReviewsGridRowAlign (сетка и карусель) */}
      <div
        data-review-header
        className="relative z-10 flex min-h-0 flex-col justify-start border-b border-[#e5e0db] pb-4 box-border"
      >
        <div className="absolute -bottom-1 left-0 h-3 w-3 rounded-full bg-[#bea692] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="grid w-full grid-cols-[auto_1fr] gap-x-3 items-start">
          <div className="relative row-start-1 shrink-0 self-start">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bea692]/30 to-[#e5e0db]/30 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-[#e5e0db] transition-all duration-300 group-hover:ring-[#bea692]/30 md:h-12 md:w-12">
              <SanityImage
                image={review.authorImage}
                width={56}
                height={56}
                alt={review.authorName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <Paragraph className="row-start-1 col-start-2 mb-0 min-w-0 text-sm font-semibold text-foreground md:text-base">
            {review.authorName}
          </Paragraph>
          {review.profession?.trim() ? (
            <p
              className={cn(
                "col-span-2 row-start-2 mt-0.5 mb-0 min-w-0 break-words text-xs italic leading-snug text-muted-foreground md:text-sm",
                professionIndent
              )}
            >
              {review.profession.trim()}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-4 md:pt-5">
        <ExpandableReviewText text={review.text} />
      </div>
    </div>
  );
}



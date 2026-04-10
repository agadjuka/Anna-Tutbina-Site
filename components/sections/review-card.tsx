import { ExpandableReviewText } from "@/components/sections/expandable-review-text";
import { Paragraph } from "@/components/ui/paragraph";
import { SanityImage } from "@/components/ui/sanity-image";
import type { ReviewItem } from "@/lib/utils/reviews";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="group relative flex flex-col h-full w-full rounded-2xl border border-[#e5e0db] bg-white px-6 pt-4 pb-4 md:px-8 md:pt-5 md:pb-5 shadow-card hover:shadow-card-hover transition-all duration-500 hover:border-[#bea692]/30">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#bea692]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl" />
      <div className="absolute top-4 -left-2 w-1 h-16 bg-gradient-to-b from-[#bea692] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

      <div className="relative z-10 flex flex-1 flex-col min-h-0">
        <div className="relative flex flex-shrink-0 items-center pb-4 border-b border-[#e5e0db]">
          {/* Декоративная точка на границе (под блоком автора) */}
          <div className="absolute -bottom-1 left-0 w-3 h-3 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex w-full items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bea692]/30 to-[#e5e0db]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <SanityImage
                image={review.authorImage}
                width={56}
                height={56}
                alt={review.authorName}
                className="relative h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-[#e5e0db] group-hover:ring-[#bea692]/30 transition-all duration-300"
              />
            </div>
            <div>
              <Paragraph className="mb-0.5 font-semibold text-foreground text-sm md:text-base">
                {review.authorName}
              </Paragraph>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full bg-[#bea692]/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col pt-4 md:pt-5">
          <div className="mb-0 flex-shrink-0">
            <div className="font-heading text-3xl leading-none text-[#bea692]/20 md:text-4xl">{"\u201C"}</div>
          </div>

          <ExpandableReviewText text={review.text} />
        </div>
      </div>
    </div>
  );
}



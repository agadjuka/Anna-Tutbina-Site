import { Paragraph } from "@/components/ui/paragraph";
import { SanityImage } from "@/components/ui/sanity-image";

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#e5e0db] bg-white p-6 md:p-8 shadow-card">
      <div className="mb-6">
        <div className="text-4xl text-[#bea692]/20 mb-4 leading-none">"</div>
        <Paragraph className="line-clamp-6 text-base md:text-lg italic text-muted-foreground leading-relaxed">
          {review.text}
        </Paragraph>
      </div>
      <div className="mt-auto pt-6 border-t border-[#e5e0db] flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bea692]/20 to-[#e5e0db]/20 blur-sm"></div>
          <SanityImage
            image={review.authorImage}
            width={56}
            height={56}
            alt={review.authorName}
            className="relative h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-[#e5e0db]"
          />
        </div>
        <Paragraph className="font-medium text-foreground text-sm md:text-base">{review.authorName}</Paragraph>
      </div>
    </div>
  );
}



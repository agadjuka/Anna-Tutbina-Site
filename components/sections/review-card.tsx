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
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Paragraph className="mb-6 line-clamp-6 text-gray-800">
        “{review.text}”
      </Paragraph>
      <div className="mt-auto flex items-center gap-4">
        <SanityImage
          image={review.authorImage}
          width={56}
          height={56}
          alt={review.authorName}
          className="h-14 w-14 rounded-full object-cover"
        />
        <Paragraph className="font-medium text-gray-900">{review.authorName}</Paragraph>
      </div>
    </div>
  );
}



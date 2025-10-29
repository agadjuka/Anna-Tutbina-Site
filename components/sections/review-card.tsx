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
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#e5e0db] bg-white p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:border-[#bea692]/30">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#bea692]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl" />
      <div className="absolute top-4 -left-2 w-1 h-16 bg-gradient-to-b from-[#bea692] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      
      <div className="mb-4 relative z-10">
        {/* Декоративная кавычка */}
        <div className="relative mb-2">
          <div className="text-4xl md:text-5xl text-[#bea692]/20 leading-none font-heading">"</div>
          <div className="absolute top-1.5 left-6 w-10 h-px bg-[#bea692]/20" />
        </div>
        
        <Paragraph className="text-sm md:text-base italic text-muted-foreground leading-[1.8]">
          {review.text}
        </Paragraph>
      </div>
      
      <div className="mt-auto pt-6 border-t border-[#e5e0db] relative">
        {/* Декоративная точка на границе */}
        <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Градиентное свечение */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bea692]/30 to-[#e5e0db]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <SanityImage
              image={review.authorImage}
              width={56}
              height={56}
              alt={review.authorName}
              className="relative h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-[#e5e0db] group-hover:ring-[#bea692]/30 transition-all duration-300"
            />
          </div>
          <div>
            <Paragraph className="font-semibold text-foreground text-sm md:text-lg mb-1">
              {review.authorName}
            </Paragraph>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#bea692]/40"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



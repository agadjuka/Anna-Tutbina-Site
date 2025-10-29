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
    <div className="group relative flex flex-col h-full w-full rounded-2xl border border-[#e5e0db] bg-white px-6 pt-4 pb-4 md:px-8 md:pt-5 md:pb-5 shadow-card hover:shadow-card-hover transition-all duration-500 hover:border-[#bea692]/30">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#bea692]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl" />
      <div className="absolute top-4 -left-2 w-1 h-16 bg-gradient-to-b from-[#bea692] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      
      <div className="relative z-10 -mt-2 flex-1 flex flex-col min-h-0">
        {/* Декоративная кавычка */}
        <div className="relative mb-0 mt-4 flex-shrink-0">
          <div className="text-3xl md:text-4xl text-[#bea692]/20 leading-none font-heading">"</div>
          <div className="absolute top-1 left-5 w-8 h-px bg-[#bea692]/20" />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <Paragraph className="text-sm md:text-base italic text-muted-foreground leading-[1.8] -mt-2 mb-6">
            {review.text}
          </Paragraph>
        </div>
      </div>
      
      <div className="h-[75px] md:h-[80px] pt-4 border-t border-[#e5e0db] relative flex-shrink-0 flex items-center">
        {/* Декоративная точка на границе */}
        <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-3 w-full">
          <div className="relative">
            {/* Градиентное свечение */}
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
            <Paragraph className="font-semibold text-foreground text-sm md:text-base mb-0.5">
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



import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsEmbla } from "@/components/sections/reviews-embla";
import { SectionHeading } from "@/components/ui/section-heading";
import { shuffleReviews, getRandomReviews } from "@/lib/utils/reviews";

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews?.length) return null;

  // Для мобильной версии: все отзывы в случайном порядке
  const shuffledReviews = shuffleReviews(reviews);
  
  // Для десктопной версии: только 4 случайных отзыва
  const desktopReviews = getRandomReviews(reviews, 4);

  return (
    <section className="relative pt-4 pb-6 md:pt-6 md:pb-8 bg-background overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#bea692]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#e5e0db]/5 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Декоративная линия слева */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#bea692]/30 to-transparent hidden lg:block" />
        
        <div className="mb-3 md:mb-4 relative">
          {/* Заголовок секции по центру */}
          <div className="relative">
            <SectionHeading as="h2">
              Что говорят наши участницы
            </SectionHeading>
          </div>
        </div>

        {/* Мобильная горизонтальная карусель - все отзывы в случайном порядке */}
        <div className="md:hidden">
          <ReviewsEmbla reviews={shuffledReviews} />
        </div>

        {/* Десктопная сетка - только 4 случайных отзыва */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {desktopReviews.map((review) => (
            <div key={review._id} className="flex">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



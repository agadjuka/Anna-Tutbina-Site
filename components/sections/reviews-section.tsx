import { Container } from "@/components/ui/container";
import { ReviewCard } from "@/components/sections/review-card";
import { ReviewsGridRowAlign } from "@/components/sections/reviews-grid-row-align";
import { ReviewsCollapseBar } from "@/components/sections/reviews-collapse-bar";
import { ReviewsExpandProvider } from "@/components/sections/reviews-expand-context";
import { ReviewsEmbla } from "@/components/sections/reviews-embla";
import { shuffleReviews, type ReviewItem } from "@/lib/utils/reviews";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

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
    /* Ритм из макета (узел `5:210`, 1921×711): эйбрау y=73, заголовок y=146
       (интерлиньяж 59), карусель y=291, карточки 400×200 с зазором 44,
       видимая область 1093px по центру, стрелки y=523. */
    <section id="reviews" className="relative bg-background py-16 lg:min-h-[min(37vw,711px)] lg:py-[min(3.8vw,73px)]">
      <Container>
      <ReviewsExpandProvider>
        <div className="relative">
          <div className="mb-10 text-center lg:mb-[min(4.48vw,86px)]">
            <SectionEyebrow className="text-subtle">
              Отзывы
            </SectionEyebrow>
            <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-foreground sm:text-[40px] lg:mt-[min(1.35vw,26px)] lg:text-[clamp(40px,2.6vw,50px)] lg:leading-[min(3.07vw,59px)]">
              Что говорят наши участницы
            </h2>
          </div>

          {/* Ширина карусели — по контейнеру: заказчик просил, чтобы в ряд
              попадали ЧЕТЫРЕ карточки целиком, без обрезанной пятой. В макете
              видимая область 1093px и в кадре 2.5 карточки по 400px — здесь мы
              от макета сознательно отходим в пользу его просьбы. */}
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
      </Container>
    </section>
  );
}

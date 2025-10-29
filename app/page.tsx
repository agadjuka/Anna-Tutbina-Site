import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, aboutQuery, reviewsQuery, customTourQuery } from "@/lib/sanity.queries";
import { AboutSection } from "@/components/sections/about-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CustomTourSection } from "@/components/sections/custom-tour-section";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
  description: "Авторские женские туры и ретриты с Анной Турбиной. Изучайте мир вместе с нами.",
};

type SanitySlug = { current: string };

interface SanityPrice {
  value: number;
  currency: string;
}

interface TourItem {
  _id: string;
  name: string;
  slug: SanitySlug;
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: SanityPrice;
}

interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

export default async function HomePage() {
  const [tours, about, reviews, customTour] = await Promise.all([
    sanityClient.fetch<TourItem[]>(toursQuery),
    sanityClient.fetch<{ image: any; bio: any }>(aboutQuery),
    sanityClient.fetch<ReviewItem[]>(reviewsQuery),
    sanityClient.fetch<{ title: string; mainImage: any } | null>(customTourQuery),
  ]);

  return (
    <main className="min-h-screen">
      {about && (
        <section id="about" className="bg-background">
          <AboutSection image={about.image} bio={about.bio} />
        </section>
      )}
      <section id="tours" className="relative py-24 md:py-32 lg:py-40 bg-background overflow-hidden">
        {/* Декоративные элементы фона */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#bea692]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e5e0db]/5 rounded-full blur-3xl" />
        
        <Container>
          <div className="relative space-y-16 md:space-y-20">
            {/* Заголовок с нестандартным размещением */}
            <div className="relative max-w-4xl">
              {/* Декоративная вертикальная линия */}
              <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#bea692] via-[#bea692]/50 to-transparent hidden lg:block" />
              
              <div className="space-y-6 pl-0 lg:pl-8">
                <div className="inline-flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-[#bea692] rounded-full" />
                    <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#bea692] font-medium">
                      Наши программы
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#bea692]/30 to-transparent max-w-32" />
                </div>
                
                <div className="space-y-4">
                  <Heading as="h2" className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-0">
                    Наши туры
                  </Heading>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Эксклюзивные путешествия, созданные для женщин, которые ценят уникальный опыт и красоту окружающего мира
                  </p>
                </div>
              </div>
              
              {/* Декоративный элемент справа */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-24 border border-[#bea692]/10 rounded-full hidden xl:block" />
            </div>
            
            {/* Сетка с асимметрией */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {tours.map((tour, index) => (
                <div
                  key={tour._id}
                  className={cn(
                    index % 3 === 1 ? "md:mt-12 lg:mt-0" : "",
                    index % 3 === 2 ? "md:mt-8 lg:mt-16" : ""
                  )}
                >
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section id="reviews" className="relative bg-white">
        <Container>
          <ReviewsSection reviews={reviews} />
        </Container>
      </section>
      {customTour && (
        <CustomTourSection title={customTour.title} mainImage={customTour.mainImage} />
      )}
    </main>
  );
}

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, aboutQuery, reviewsQuery, customTourQuery } from "@/lib/sanity.queries";
import { AboutSection } from "@/components/sections/about-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CustomTourSection } from "@/components/sections/custom-tour-section";
import { SectionHeading } from "@/components/ui/section-heading";
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
      <section id="tours" className="relative py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
        {/* Декоративные элементы фона */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#bea692]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e5e0db]/5 rounded-full blur-3xl" />
        
        <Container>
          <div className="relative space-y-10 md:space-y-12">
            {/* Заголовок секции */}
            <div className="relative">
              <SectionHeading as="h2" className="mb-6">
                Наши туры
              </SectionHeading>
            </div>
            
            {/* Сетка с центрированием, максимум 3 в ряд */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.67rem)]"
                  style={{ maxWidth: '400px', flexShrink: 0 }}
                >
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section id="reviews" className="relative bg-background">
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

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, aboutQuery, reviewsQuery, customTourQuery } from "@/lib/sanity.queries";
import { AboutSection } from "@/components/sections/about-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CustomTourSection } from "@/components/sections/custom-tour-section";
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
    <main className="min-h-screen py-8">
      {about && (
        <section id="about" className="py-16 md:py-24">
          <AboutSection image={about.image} bio={about.bio} />
        </section>
      )}
      <section id="tours" className="py-16 md:py-24">
      <Container>
        <div className="space-y-8">
          <Heading as="h2">Наши туры</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />)
            )}
          </div>
        </div>
      </Container>
      </section>
      <section id="reviews" className="py-16 md:py-24">
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

import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, toursWithReviewsQuery, customTourQuery, faqQuery, homePageQuery } from "@/lib/sanity.queries";
import { isTourVisibleOnSite } from "@/lib/tour-visibility";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CustomTourSection } from "@/components/sections/custom-tour-section";
import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq-section";
import { flattenReviewsFromTours, type TourReviewRaw } from "@/lib/utils/reviews";

/** Список туров и отзывы должны совпадать с Sanity без устаревшего статического кэша. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Главная",
  description: "Авторские женские туры и ретриты с Анной Турбиной. Изучайте мир вместе с нами.",
  alternates: {
    canonical: "/",
  },
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
  cardImage?: any;
  mainImage: any;
  shortDescription: string;
  dates?: string;
  year?: number | null;
  overlayName?: string | null;
  overlayDate?: string | null;
  price?: SanityPrice;
}

type TourItemFromSanity = TourItem & { hideFromSite?: boolean | null };

interface HeroContent {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  subheadingAccent?: string;
  photos?: any[];
}

interface AboutContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photos?: any[];
}

interface CalendarContent {
  eyebrow?: string;
  heading?: string;
}

export default async function HomePage() {
  noStore();

  const [toursRaw, toursForReviews, customTour, faqItems, homePage] = await Promise.all([
    sanityClient.fetch<TourItemFromSanity[]>(toursQuery),
    sanityClient.fetch<{ _id: string; reviews?: TourReviewRaw[] }[]>(toursWithReviewsQuery),
    sanityClient.fetch<{ title: string; mainImage: any } | null>(customTourQuery),
    sanityClient.fetch(faqQuery),
    sanityClient.fetch<{ hero?: HeroContent; about?: AboutContent; calendar?: CalendarContent } | null>(homePageQuery),
  ]);

  const tours: TourItem[] = toursRaw
    .filter((t) => isTourVisibleOnSite(t.hideFromSite))
    .map(({ hideFromSite: _hidden, ...rest }) => rest);

  const reviews = flattenReviewsFromTours(toursForReviews);

  return (
    <main className="min-h-screen">
      {homePage?.hero && <HeroSection hero={homePage.hero} />}
      {homePage?.about && <AboutSection about={homePage.about} />}
      <CalendarSection calendar={homePage?.calendar} tours={tours} />
      <section id="reviews" className="relative bg-background">
        <Container>
          <ReviewsSection reviews={reviews} />
        </Container>
      </section>
      {customTour && (
        <CustomTourSection title={customTour.title} mainImage={customTour.mainImage} />
      )}

      {/* FAQ ниже Заказать индивидуальный тур */}
      <FaqSection items={faqItems} />
    </main>
  );
}

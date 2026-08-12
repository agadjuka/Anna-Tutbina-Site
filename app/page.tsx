import { unstable_noStore as noStore } from "next/cache";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, toursWithReviewsQuery, customTourQuery, faqQuery, homePageQuery, siteSettingsQuery } from "@/lib/sanity.queries";
import { isTourVisibleOnSite } from "@/lib/tour-visibility";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSection } from "@/components/sections/values-section";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
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

interface ValuesItem {
  title?: string;
  text?: string;
}

interface ValuesContent {
  eyebrow?: string;
  heading?: string;
  backgroundImage?: any;
  backgroundImageRight?: any;
  items?: ValuesItem[];
}

interface GuestsContent {
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  items?: string[];
  body?: any;
  photos?: any[];
}

interface FoundersLink {
  label?: string;
  url?: string;
}

interface FounderPerson {
  photo?: any;
  name?: string;
  role?: string;
  description?: string;
}

interface FoundersContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photo?: any;
  links?: FoundersLink[];
  founderOne?: FounderPerson;
  founderTwo?: FounderPerson;
}

interface FaqHeadingContent {
  eyebrow?: string;
  heading?: string;
}

interface CollabContent {
  eyebrow?: string;
  homeHeading?: string;
  homeHeadingAccent?: string;
  homeDescription?: any;
  images?: any[];
  tags?: string[];
}

export default async function HomePage() {
  noStore();

  const [toursRaw, toursForReviews, customTour, faqItems, homePage, siteSettings] = await Promise.all([
    sanityClient.fetch<TourItemFromSanity[]>(toursQuery),
    sanityClient.fetch<{ _id: string; reviews?: TourReviewRaw[] }[]>(toursWithReviewsQuery),
    sanityClient.fetch<CollabContent | null>(customTourQuery),
    sanityClient.fetch(faqQuery),
    sanityClient.fetch<{
      hero?: HeroContent;
      about?: AboutContent;
      calendar?: CalendarContent;
      values?: ValuesContent;
      guests?: GuestsContent;
      founders?: FoundersContent;
      faq?: FaqHeadingContent;
    } | null>(homePageQuery),
    sanityClient.fetch<{
      primaryContacts?: Array<{
        label?: string;
        url?: string;
        icon?: string;
      }>;
    } | null>(siteSettingsQuery),
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
      <ValuesSection values={homePage?.values} />
      <GuestsSection guests={homePage?.guests} />
      <FoundersSection founders={homePage?.founders} />
      <ReviewsSection reviews={reviews} />
      <CollabSection collab={customTour} primaryContacts={siteSettings?.primaryContacts ?? []} />

      {/* FAQ ниже Заказать индивидуальный тур */}
      <FaqSection items={faqItems} faq={homePage?.faq} />
    </main>
  );
}

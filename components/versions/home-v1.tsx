import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSection } from "@/components/sections/values-section";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import type { HomeData } from "@/lib/home-data";

/**
 * ВЕРСИЯ 1 — базовая. Это же используется на реальной главной `/`,
 * поэтому правки здесь меняют и боевой сайт, и версию 1 (так и задумано:
 * версия 1 по определению = «как на сайте сейчас»).
 */
export function HomeV1({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <main className="min-h-screen">
      {homePage?.hero && <HeroSection hero={homePage.hero} />}
      {homePage?.about && <AboutSection about={homePage.about} />}
      <CalendarSection calendar={homePage?.calendar} tours={tours} />
      <ValuesSection values={homePage?.values} />
      <GuestsSection guests={homePage?.guests} />
      <FoundersSection founders={homePage?.founders} />
      <ReviewsSection reviews={reviews} />
      <CollabSection collab={customTour} primaryContacts={primaryContacts} />
      <FaqSection items={faqItems} faq={homePage?.faq} />
    </main>
  );
}

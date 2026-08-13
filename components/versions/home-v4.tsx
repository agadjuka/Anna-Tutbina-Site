import { HeroSectionFullscreenV4 } from "@/components/sections/hero-section-fullscreen-v4";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSectionEditorial } from "@/components/sections/values-section-editorial";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import type { HomeData } from "@/lib/home-data";

/**
 * ВЕРСИЯ 4 — версия 3, но HERO на весь экран и на десктопе тоже.
 *
 * Отличие от v3 — только HERO: `HeroSectionFullscreenV4`
 * (`components/sections/hero-section-fullscreen-v4.tsx`) вместо
 * `HeroSectionFullscreen`. Мобильная часть внутри — та же самая, что в v3;
 * desktop — новый полноэкранный bento (100vh), а не прежний баннер
 * `aspect-[1920/590]`. Блок «Наши ценности» переиспользован как в v3
 * (`ValuesSectionEditorial`, редакционный список на мобильной). Остальные
 * секции — без изменений, как в v1.
 */
export function HomeV4({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <main className="min-h-screen">
      {homePage?.hero && <HeroSectionFullscreenV4 hero={homePage.hero} />}
      {homePage?.about && <AboutSection about={homePage.about} />}
      <CalendarSection calendar={homePage?.calendar} tours={tours} />
      <ValuesSectionEditorial values={homePage?.values} />
      <GuestsSection guests={homePage?.guests} />
      <FoundersSection founders={homePage?.founders} />
      <ReviewsSection reviews={reviews} />
      <CollabSection collab={customTour} primaryContacts={primaryContacts} />
      <FaqSection items={faqItems} faq={homePage?.faq} />
    </main>
  );
}

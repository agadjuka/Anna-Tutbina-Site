import { HeroSectionFullscreen } from "@/components/sections/hero-section-fullscreen";
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
 * ВЕРСИЯ 3 — новый HERO + мобильный список ценностей.
 *
 * Все блоки — те же секции из `components/sections/`, что и в v1, кроме двух:
 * - HERO → `HeroSectionFullscreen` (первый экран на весь viewport, без
 *   мобильного radial-scrim, полноэкранный bento-коллаж, Ken Burns);
 * - VALUES → `ValuesSectionEditorial` (мобильная подача 6 пунктов — тонкий
 *   редакционный список вместо сетки карточек).
 *
 * Оба — отдельные компоненты рядом со старыми (`hero-section.tsx`,
 * `values-section.tsx` не тронуты); desktop-раскладка в обоих идентична
 * оригиналу. Остальные секции переиспользованы без изменений.
 */
export function HomeV3({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <main className="min-h-screen">
      {homePage?.hero && <HeroSectionFullscreen hero={homePage.hero} />}
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

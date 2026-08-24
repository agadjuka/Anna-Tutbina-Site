import { HeroSectionFullscreenV4 } from "@/components/sections/hero-section-fullscreen-v4";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSectionEditorial } from "@/components/sections/values-section-editorial";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import { PageScale } from "@/components/versions/page-scale";
import type { HomeData } from "@/lib/home-data";

/**
 * Общая реализация «облегчённых» версий (v7/v8/v9) — ответ на правку
 * заказчика 2026-08-23 про тяжеловесность главной, разбор и цифры в
 * `docs/redesign/lightweight-scale-plan.md`.
 *
 * Секции — ровно те же, что у `HomeV6`, без единой правки внутри них: весь
 * эффект даёт CSS-слой в `globals.css` (`html[data-ona-scale]`), включаемый
 * через `PageScale`. Здесь сознательно нет анимаций появления (`<Reveal>`,
 * `.v6-cine`) — три версии сравнивают ТОЛЬКО масштаб, лишнее движение мешало
 * бы этому сравнению. HERO не масштабируется ни в одной версии (полноэкранный
 * первый экран — отдельный вопрос, не про «тяжесть» прокрутки).
 */
export function HomeLight({ data, scale }: { data: HomeData; scale: "v7" | "v8" | "v9" }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <>
      <PageScale scale={scale} />
      <main className="min-h-screen">
        {homePage?.hero && <HeroSectionFullscreenV4 hero={homePage.hero} />}
        {homePage?.about && <AboutSection about={homePage.about} />}
        <CalendarSection calendar={homePage?.calendar} tours={tours} />
        <ValuesSectionEditorial values={homePage?.values} />
        <GuestsSection guests={homePage?.guests} />
        <FoundersSection founders={homePage?.founders} />
        <ReviewsSection reviews={reviews} />
        <CollabSection collab={customTour} primaryContacts={primaryContacts} decorPhoto={homePage?.about?.photos?.[1]} />
        <FaqSection items={faqItems} faq={homePage?.faq} />
      </main>
    </>
  );
}

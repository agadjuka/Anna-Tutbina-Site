import { HeroSectionFullscreenV4 } from "@/components/sections/hero-section-fullscreen-v4";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSectionEditorial } from "@/components/sections/values-section-editorial";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Reveal } from "@/components/ui/reveal";
import type { HomeData } from "@/lib/home-data";

/**
 * ВЕРСИЯ 5 — версия 4 (полноэкранный HERO) + анимации по всему сайту.
 *
 * Секции переиспользованы без изменений (кроме HERO/VALUES, как в v3/v4),
 * весь слой анимаций подключается декларативно, без переписывания секций:
 * - `<Reveal>` вокруг каждой секции (кроме HERO) — уже существовавший
 *   компонент из v2, не написан заново;
 * - обёртка `.v5-scene` — hover-подъём кнопок/ссылок, лёгкий zoom фото при
 *   наведении, поштучное появление элементов внутри GUESTS/FOUNDERS. Правила
 *   лежат в `globals.css`, область действия ограничена этим классом —
 *   v1/v2/v3/v4 не затронуты;
 * - HERO → `HeroSectionFullscreenV4` (та же, что в версии 4 — полноэкранный
 *   и на десктопе, и на мобильной);
 * - VALUES → `ValuesSectionEditorial` (как в v3/v4).
 *
 * Кольца в футере (эффект «воды», SVG-фильтр) — не привязаны к версии, футер
 * общий для всего сайта (`app/layout.tsx`), поэтому эффект виден на всех
 * версиях и на боевом сайте, см. `components/sections/footer.tsx`.
 *
 * HERO намеренно без `<Reveal>` — как в v2/v3/v4: он сам себе первый экран,
 * появление «снизу вверх» поверх уже идущей анимации коллажа выглядело бы как
 * тормоз загрузки, а не как анимация.
 */
export function HomeV5({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <div className="v5-scene">
      <main className="min-h-screen">
        {homePage?.hero && <HeroSectionFullscreenV4 hero={homePage.hero} />}

        <Reveal>{homePage?.about && <AboutSection about={homePage.about} />}</Reveal>
        <Reveal>
          <CalendarSection calendar={homePage?.calendar} tours={tours} />
        </Reveal>
        <Reveal>
          <ValuesSectionEditorial values={homePage?.values} />
        </Reveal>
        <Reveal>
          <GuestsSection guests={homePage?.guests} />
        </Reveal>
        <Reveal>
          <FoundersSection founders={homePage?.founders} />
        </Reveal>
        <Reveal>
          <ReviewsSection reviews={reviews} />
        </Reveal>
        <Reveal>
          <CollabSection collab={customTour} primaryContacts={primaryContacts} />
        </Reveal>
        <Reveal>
          <FaqSection items={faqItems} faq={homePage?.faq} />
        </Reveal>
      </main>
    </div>
  );
}

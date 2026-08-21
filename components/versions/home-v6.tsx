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
 * ВЕРСИЯ 6 — источник: пакет `версия 6/` в корне проекта (заказчик подготовил
 * заранее, там же ссылался голосом: «она в папке в корне версия 6»).
 *
 * Слой анимаций переработан с нуля относительно v5: там было простое
 * fade+сдвиг на 10px (почти не читалось как «анимированный сайт»). Здесь
 * каждая секция — кинематографичный wipe (подъём + масштаб + расфокусировка,
 * expo-out, 1.1s), заголовки открываются "шторкой" (clip-path), карточки/
 * списки внутри секции — волной по очереди. Все правила — `.v6-scene` в
 * globals.css, v1–v5 и боевой сайт не затронуты.
 *
 * HERO — переиспользован `HeroSectionFullscreenV4` (тот же, что в v4/v5:
 * полноэкранный на десктопе и мобильной, Ken Burns, маркер прокрутки снизу) —
 * пакет из папки предлагал переписать заново `hero-section-fullscreen.tsx`
 * напрямую, но это общий файл с v3 (десктоп там намеренно не тронут), поэтому
 * взят уже готовый и проверенный v4-вариант вместо повторной правки shared-файла.
 *
 * Кольца в футере («вода») — общий компонент для всех версий, но фильтр
 * (`onaWaterIdle`/`onaWaterActive` в footer.tsx) обновлён на более мягкий по
 * тому же пакету — эффект виден everywhere, не только в v6.
 *
 * HERO намеренно без `<Reveal>` — как в v2–v5: сам себе первый экран.
 */
export function HomeV6({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <div className="v6-scene">
      <main className="min-h-screen">
        {homePage?.hero && <HeroSectionFullscreenV4 hero={homePage.hero} />}

        <Reveal className="v6-cine">{homePage?.about && <AboutSection about={homePage.about} />}</Reveal>
        <Reveal className="v6-cine">
          <CalendarSection calendar={homePage?.calendar} tours={tours} />
        </Reveal>
        <Reveal className="v6-cine">
          <ValuesSectionEditorial values={homePage?.values} />
        </Reveal>
        <Reveal className="v6-cine">
          <GuestsSection guests={homePage?.guests} />
        </Reveal>
        <Reveal className="v6-cine">
          <FoundersSection founders={homePage?.founders} />
        </Reveal>
        <Reveal className="v6-cine">
          <ReviewsSection reviews={reviews} />
        </Reveal>
        <Reveal className="v6-cine">
          <CollabSection
            collab={customTour}
            primaryContacts={primaryContacts}
            decorPhoto={homePage?.about?.photos?.[1]}
          />
        </Reveal>
        <Reveal className="v6-cine">
          <FaqSection items={faqItems} faq={homePage?.faq} />
        </Reveal>
      </main>
    </div>
  );
}

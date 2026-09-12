import { HeroSectionVideo } from "@/components/sections/hero-section-video";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSection } from "@/components/sections/values-section";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Reveal } from "@/components/ui/reveal";
import type { HomeData } from "@/lib/home-data";

/**
 * ГЛАВНАЯ СТРАНИЦА САЙТА — состав секций боевой `/` (`app/page.tsx`).
 *
 * Размеры — облегчённые (заказчик выбрал их 25.08.2026) и записаны прямо в
 * классах секций по закону одного множителя (`--ona-u` на `:root` в
 * `globals.css`), без отдельного слоя переопределений.
 *
 * Первый экран — видео (`hero-section-video.tsx`), с 11.09.2026. Прежний
 * bento-коллаж из пяти фото удалён 12.09 вместе с системой версий; код —
 * `Архив/versions-system-2026-09-12/` и история git.
 *
 * АНИМАЦИИ: кинематографичное появление секций при прокрутке — обёртка
 * `.v6-scene` + `<Reveal className="v6-cine">` у каждой секции (правила в
 * `globals.css`, разбор — `docs/redesign/animations-restore.md`).
 *
 * ⚠️ HERO намеренно БЕЗ `<Reveal>` — он сам себе первый экран и появляется
 * по-своему (Ken Burns, маркер прокрутки).
 *
 * ⚠️ `prefers-reduced-motion` соблюдается: у пользователя с системной
 * настройкой «уменьшить анимацию» секции появляются только прозрачностью, без
 * сдвига и масштаба — это правильное поведение, менять не надо.
 */
export function HomeLight({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <>
      <div className="v6-scene">
        <main className="min-h-screen">
          <HeroSectionVideo video={homePage?.hero?.video} />

          <Reveal className="v6-cine">
            {homePage?.about && <AboutSection about={homePage.about} />}
          </Reveal>
          <Reveal className="v6-cine">
            <CalendarSection calendar={homePage?.calendar} tours={tours} />
          </Reveal>
          <Reveal className="v6-cine">
            <ValuesSection values={homePage?.values} />
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
          {/* Цветок COLLAB — из СВОЕГО поля `decorPhoto` в «Индивидуальном туре».
              Раньше сюда шло второе фото блока «О проекте», и один и тот же файл
              работал сразу на два блока: заменив картинку для «Сотрудничества»,
              заказчик менял её и в «О проекте», хотя в макете цветы разные.
              Второе фото ABOUT осталось запасным вариантом — на случай, если поле
              ещё не заполнено. */}
          <Reveal className="v6-cine">
            <CollabSection
              collab={customTour}
              primaryContacts={primaryContacts}
              decorPhoto={customTour?.decorPhoto ?? homePage?.about?.photos?.[1]}
            />
          </Reveal>
          <Reveal className="v6-cine">
            <FaqSection items={faqItems} faq={homePage?.faq} />
          </Reveal>
        </main>
      </div>
    </>
  );
}

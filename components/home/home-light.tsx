import { HeroSectionFullscreenV4 } from "@/components/sections/hero-section-fullscreen-v4";
import { HeroSectionVideo } from "@/components/sections/hero-section-video";
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
 * ГЛАВНАЯ СТРАНИЦА САЙТА (боевая, `app/page.tsx` → `hero="video"`).
 *
 * С 2026-08-25 — облегчённый масштаб v8, с 2026-09-11 — ещё и видео на первом
 * экране вместо коллажа (проп `hero`, см. ниже).
 *
 * Изначально — общая реализация «облегчённых» версий сравнения v7/v8/v9 (ответ
 * на правку заказчика 2026-08-23 про тяжеловесность главной, разбор и цифры в
 * `docs/redesign/lightweight-scale-plan.md`). Заказчик выбрал вариант v8, и этот
 * компонент переехал из `components/versions/` сюда: он больше не «версия», а
 * боевая главная. Версии v7/v9 продолжают ссылаться на него, но они в архиве
 * (`lib/versions.ts`, статус `archived`) и уйдут вместе со всей папкой
 * `components/versions/` — см. `docs/versions-cleanup-plan.md`.
 *
 * Размеры облегчённого масштаба v8 с 11.09.2026 записаны прямо в классах
 * секций (закон одного множителя, `--ona-u` на `:root` в `globals.css`) — они
 * «по умолчанию», без отдельного слоя переопределений и без атрибута на
 * `<html>`. Прежний проп `scale` (v7/v8/v9) и `PageScale` удалены: архивные
 * v7 и v9 теперь выглядят как v8 — они всё равно в архиве.
 *
 * АНИМАЦИИ ВЕРНУЛИСЬ 2026-08-25 (`docs/redesign/animations-restore.md`).
 * Пока это был один из трёх вариантов сравнения, движение выключали намеренно —
 * заказчик сравнивал только размеры. Когда v8 стал боевой главной, вместе с ним
 * на `/` переехало и отсутствие анимаций, хотя кинематографичный слой версии 6
 * заказчик согласовал ещё 20.08. Слой не удалялся — он заперт под `.v6-scene`
 * и просто не срабатывал, потому что элемента с этим классом на странице не
 * было. Теперь обёртка на месте, каждая секция — в `<Reveal className="v6-cine">`.
 *
 * ⚠️ HERO намеренно БЕЗ `<Reveal>` — он сам себе первый экран и появляется
 * по-своему (Ken Burns, маркер прокрутки). Так было во всех версиях с v2 по v6.
 *
 * ⚠️ `prefers-reduced-motion` тут СОБЛЮДАЕТСЯ, в отличие от `/versions/*`, где
 * его форсировал `<ForceMotion>`. У пользователя с системной настройкой
 * «уменьшить анимацию» секции появятся только прозрачностью, без сдвига и
 * масштаба — это правильное поведение, менять не надо.
 */
export function HomeLight({
  data,
  hero = "collage",
}: {
  data: HomeData;
  /**
   * Какой первый экран показать. `video` — фоновый ролик (`hero-section-video.tsx`),
   * он на боевой главной с 2026-09-11; `collage` — прежний bento из пяти фото.
   * Всё, что ниже HERO, у обоих вариантов одинаковое.
   *
   * Значение по умолчанию намеренно осталось `collage`: без пропа `HomeLight`
   * вызывают архивные версии v7/v8/v9, и они должны показывать ровно то, что
   * показывали при сравнении. Боевая главная передаёт `video` явно.
   */
  hero?: "collage" | "video";
}) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <>
      <div className="v6-scene">
        <main className="min-h-screen">
          {hero === "video" ? (
            <HeroSectionVideo video={homePage?.hero?.video} />
          ) : (
            homePage?.hero && <HeroSectionFullscreenV4 hero={homePage.hero} />
          )}

          <Reveal className="v6-cine">
            {homePage?.about && <AboutSection about={homePage.about} />}
          </Reveal>
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

import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";

interface HeroContent {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  subheadingAccent?: string;
  photos?: any[];
}

interface HeroSectionProps {
  hero?: HeroContent | null;
}

/**
 * Раскладка коллажа из макета (Figma 5:5) в процентах от кадра 1920×590.
 * Порядок слотов = порядок фотографий в Sanity.
 * `float` — длительность покачивания, разная, чтобы фото не двигались синхронно.
 */
const PHOTO_SLOTS = [
  { left: "4.22%", top: "41.86%", width: "11.04%", height: "44.07%", opacity: 0.95, float: "9s" },
  { left: "12.55%", top: "22.88%", width: "8.33%", height: "27.8%", opacity: 1, float: "11s" },
  { left: "17.5%", top: "46.44%", width: "9.38%", height: "36.95%", opacity: 0.91, float: "10s" },
  { left: "73.75%", top: "43.56%", width: "11.15%", height: "35.42%", opacity: 0.9, float: "12s" },
  { left: "83.91%", top: "24.07%", width: "11.88%", height: "57.97%", opacity: 0.95, float: "8.5s" },
] as const;

/**
 * Мобильная раскладка коллажа — в макете Figma её нет (там только десктоп 1920,
 * см. docs/redesign/backlog.md п.4). Первая версия (4 угла) не устроила заказчика:
 * попросил повторить десктопную композицию — 3 фото «склеены» слева, 2 справа
 * (см. `PHOTO_SLOTS` выше), без обрезки/зума. Здесь тот же приём: пропорции
 * ширина/высота каждого слота **точно те же**, что в `PHOTO_SLOTS` (вычислены из
 * тех же исходных %), только сам размер отмасштабирован под мобильный экран —
 * `object-cover` поэтому кадрирует картинку так же, просто в другом масштабе.
 * Кластеры чуть заходят за край секции (обрезаются `overflow-hidden` на `<section>`).
 * Позиция — % от высоты контейнера (высота на мобильном не фиксирована, зависит от
 * текста), размер — vw (масштаб от ширины экрана).
 *
 * Читаемость текста поверх фото решена не приглушением самих фото (первая версия
 * растворяла их почти вусмерть и текст всё равно спорил с краями кадров), а
 * scrim-подложкой — см. `HERO_SCRIM` ниже. Фото за счёт этого можно оставить
 * заметными (`opacity` выше, лёгкий блюр для мягкого фона) — экран читается
 * как «текст на плашке нашего фонового цвета, фото уходят за края».
 */
const MOBILE_PHOTO_SLOTS = [
  // левый кластер — 3 фото внахлёст, порядок = порядок отрисовки (последний поверх)
  { top: "34%", left: "-7vw", width: "34vw", height: "41.7vw", opacity: 0.85, float: "10s" },
  { top: "4%", left: "10vw", width: "25.6vw", height: "26.3vw", opacity: 0.88, float: "12s" },
  { top: "56%", left: "15vw", width: "29vw", height: "35vw", opacity: 0.88, float: "11s" },
  // правый кластер — 2 фото внахлёст
  { top: "32%", right: "-6vw", width: "34.3vw", height: "33.5vw", opacity: 0.85, float: "9s" },
  { top: "3%", right: "9vw", width: "36.6vw", height: "54.9vw", opacity: 0.85, float: "13s" },
] as const;

/**
 * Scrim ("Designing Accessible Text Over Images", Smashing Magazine, 2023 —
 * см. отчёт по блоку) — вместо тёмной плашки берём наш `--color-background`:
 * текст всегда сидит на «родном» фоне сайта (тот же контраст текста, что и
 * везде на сайте), к краям градиент гаснет и открывает фото-кластеры.
 *
 * Подбирался через побайтовую проверку пикселей скриншота (не на глаз — цвет
 * подложки совпадает с фоном страницы, поэтому «на глаз» через сжатую превьюшку
 * скрим и фото визуально неотличимы даже когда размер эллипса задан неверно).
 * Первая прикидка (72%/88%) перекрывала вообще весь экран — фото не проглядывали
 * нигде; текущие 34%/40% проверены: в центре (под текстом) — ровно `--color-background`,
 * в зоне фото-кластеров — цвет самого фото.
 */
const HERO_SCRIM_STYLE = {
  // Затухаем не в `transparent` (это rgba(0,0,0,0) — при интерполяции альфы
  // получается тёмная кайма, цвет едет к чёрному), а в тот же `--color-background`
  // с обнулённой альфой через relative color syntax — канал RGB не плывёт.
  background:
    "radial-gradient(40% 36% at 50% 47%, var(--color-background) 52%, rgb(from var(--color-background) r g b / 0) 100%)",
};

/** Кнопки первого экрана. Ведут на секции календаря и ценностей. */
/* Якоря без ведущего слэша — они указывают на секции этой же страницы, поэтому
   одинаково работают и на `/`, и через обходной `/admin` (см. middleware.ts),
   и на тестовых страницах-копиях. С `/#values` браузер уходил на `/`, попадал
   под редирект middleware и ссылка «вела в никуда». */
const CTA_PRIMARY = { label: "Смотреть календарь", href: "#tours" };
const CTA_SECONDARY = { label: "Наши ценности", href: "#values" };

/**
 * На мобильном чуть компактнее макетного `h-14`, но не миниатюрные — первая версия
 * (`h-10`, `text-[11px]`) заказчик попросил укрупнить 2026-08-11. От `sm` — уже
 * ровно макетный размер. `whitespace-nowrap` + горизонтальный `flex` в родителе —
 * кнопки не переносятся в столбец даже на мобильном.
 */
const CTA_BASE =
  "inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-4 text-[12px] font-medium tracking-[0.01em] transition-colors duration-300 sm:h-14 sm:px-8 sm:text-sm sm:font-semibold sm:tracking-[0.03em]";

export function HeroSection({ hero }: HeroSectionProps) {
  const photos = (hero?.photos ?? []).slice(0, PHOTO_SLOTS.length);
  const mobilePhotos = (hero?.photos ?? []).slice(0, MOBILE_PHOTO_SLOTS.length);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      <div className="relative isolate mx-auto w-full lg:aspect-[1920/590] lg:max-w-[1920px]">
        {mobilePhotos.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-0 lg:hidden" aria-hidden="true">
            {mobilePhotos.map((photo, index) => {
              const slot = MOBILE_PHOTO_SLOTS[index];

              return (
                <div
                  key={photo?._key ?? index}
                  className="hero-photo-in absolute overflow-hidden rounded-md"
                  style={{
                    top: slot.top,
                    left: "left" in slot ? slot.left : undefined,
                    right: "right" in slot ? slot.right : undefined,
                    width: slot.width,
                    height: slot.height,
                    animationDelay: `${200 + index * 120}ms`,
                  }}
                >
                  <div
                    className="hero-photo-float relative h-full w-full blur-[0.5px]"
                    style={
                      {
                        opacity: slot.opacity,
                        "--hero-float-duration": slot.float,
                        animationDelay: `${index * 700}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <SanityImage image={photo} fill className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mobilePhotos.length > 0 && (
          <div
            className="pointer-events-none absolute inset-0 z-[5] lg:hidden"
            style={HERO_SCRIM_STYLE}
            aria-hidden="true"
          />
        )}

        {/* Коллаж по макету 1920 — только от lg, ниже вместо него мобильный слой выше */}
        {photos.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden="true">
            {photos.map((photo, index) => {
              const slot = PHOTO_SLOTS[index];

              return (
                <div
                  key={photo?._key ?? index}
                  className="hero-photo-in absolute"
                  style={{
                    left: slot.left,
                    top: slot.top,
                    width: slot.width,
                    height: slot.height,
                    animationDelay: `${200 + index * 120}ms`,
                  }}
                >
                  <div
                    className="hero-photo-float relative h-full w-full"
                    style={
                      {
                        opacity: slot.opacity,
                        "--hero-float-duration": slot.float,
                        animationDelay: `${index * 700}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <SanityImage image={photo} fill className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/*
          Отступы/шрифты на lg заданы в vw (X px / 1920 * 100), а не в px из макета:
          контейнер держит высоту через aspect-ratio и линейно скейлится с шириной экрана,
          поэтому vw-эквиваленты остаются пропорциональны макету на любой lg-ширине
          (баг из backlog.md п.1.5 — на 1366/1440px текст с кнопками вылезал за контейнер).
          2026-08-11: обёрнуто в clamp(min, Xvw, X%×19.2px) — сам HERO ничем не ограничен
          по ширине (не в Container), поэтому без верхней границы vw рос до абсурда на
          широких мониторах (см. backlog.md п.0). Верхняя граница = значение при 1920px
          (макет), нижняя — прежний md-тир, чтобы не было провала на переходе в lg.
          Этого одного было недостаточно: фото коллажа позиционируются в % от
          aspect-ratio-контейнера ниже, а не в vw — контейнер сам по себе продолжал
          расти в ширину/высоту без ограничения, из-за чего после клампа текста фото
          и текст разъезжались по вертикали (текст «замер», фото — нет). Добавлен
          `lg:max-w-[1920px]` на сам контейнер — теперь оба ограничены одной и той же
          точкой (1920px), дальше блок просто центрируется, не растёт.
        */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center md:py-20 lg:absolute lg:inset-0 lg:justify-start lg:py-0 lg:pt-[clamp(40px,4.2708vw,82px)]">
          {hero?.eyebrow && (
            <p className="hero-fade-up max-w-[260px] text-[12px] font-medium uppercase leading-[1.35] tracking-[0.18em] text-primary md:text-[15px] lg:max-w-none lg:whitespace-nowrap">
              {hero.eyebrow}
            </p>
          )}

          {hero?.heading && (
            <h1
              className="hero-fade-up mt-6 max-w-[885px] font-heading text-[38px] leading-[0.95] text-primary md:mt-8 md:text-[52px] lg:mt-[clamp(32px,4.7917vw,92px)] lg:text-[clamp(52px,3.125vw,60px)] lg:leading-[0.85]"
              style={{ animationDelay: "120ms" }}
            >
              {hero.heading}
            </h1>
          )}

          {(hero?.subheading || hero?.subheadingAccent) && (
            <p
              className="hero-fade-up mt-4 max-w-[674px] font-heading text-[24px] leading-[1.1] text-primary md:text-[34px] lg:mt-[clamp(0px,0.5208vw,10px)] lg:text-[clamp(34px,2.34375vw,45px)] lg:leading-[0.78]"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subheading}
              {hero.subheading && hero.subheadingAccent ? " " : null}
              {hero.subheadingAccent && <em className="italic">{hero.subheadingAccent}</em>}
            </p>
          )}

          <div
            className="hero-fade-up mt-9 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-6 lg:mt-[clamp(36px,3.4375vw,66px)] lg:flex-nowrap lg:gap-[clamp(24px,2.2917vw,44px)]"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href={CTA_PRIMARY.href}
              className={cn(
                CTA_BASE,
                "border border-primary bg-primary text-on-primary hover:bg-primary-dark"
              )}
            >
              {CTA_PRIMARY.label}
            </Link>
            <Link
              href={CTA_SECONDARY.href}
              className={cn(
                CTA_BASE,
                // bg-background — чтобы кнопка не «просвечивала» коллажем позади неё
                // на мобильном, а читалась как кнопка (правка заказчика 2026-08-11)
                "border border-primary bg-background text-primary hover:bg-primary hover:text-on-primary"
              )}
            >
              {CTA_SECONDARY.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

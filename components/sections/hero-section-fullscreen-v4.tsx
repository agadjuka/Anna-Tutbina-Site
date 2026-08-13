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

interface HeroSectionFullscreenV4Props {
  hero?: HeroContent | null;
}

/**
 * v4 — новый компонент (docs/VERSIONS.md: блок реально другой → новый файл,
 * `hero-section-fullscreen.tsx` версии 3 не тронут — там desktop сознательно
 * оставлен как в v1).
 *
 * Мобильная раскладка (<lg) — 1-в-1 та же, что в v3 (fullscreen bento + Ken
 * Burns + затемнение снизу под текст), просто скопирована сюда без изменений:
 * блок один и тот же, дублировать компонент ради идентичного куска смысла нет,
 * но и делить один файл на два экспорта ради этого не стали — v4 самодостаточен.
 *
 * Desktop (lg+) — тот же язык, что у мобильной версии, но не копия: bento на
 * весь экран (100vh) — одно большое фото слева (55%) + 4 в сетке 2×2 справа
 * (без частично прозрачных «парящих» карточек, как было в v1/v3), Ken Burns,
 * затемнение снизу вверх, крупный заголовок по центру внизу экрана.
 */

const MOBILE_BENTO_SLOTS = [
  { top: "0%", left: "0%", width: "58%", height: "64%" },
  { top: "0%", left: "58%", width: "42%", height: "38%" },
  { top: "38%", left: "58%", width: "42%", height: "40%" },
  { top: "64%", left: "0%", width: "58%", height: "36%" },
  { top: "78%", left: "58%", width: "42%", height: "22%" },
] as const;

/** Все 5 фото героя в Sanity — портретные (соотношение сторон 0.67–0.98,
 * проверено через metadata.dimensions). Первая версия сетки (1 большой тайл
 * 55%×100% + сетка 2×2 справа) давала у большого тайла целевую пропорцию
 * ~0.98 (почти квадрат) — источник резался очень сильно по ширине, отсюда
 * жалоба «фото сильно обрезаются».
 *
 * Пересчитано под 3 колонки в полную высоту (без квадратного тайла): у первой
 * колонки (38% ширины, 100% высоты) целевая пропорция на 1600×900 ≈ 0.68 —
 * почти совпадает с самыми узкими исходниками (0.667–0.82), обрезка резко
 * меньше. Колонки 2 и 3 делятся пополам по высоте — так на экране всё равно
 * 5 фото и сохраняется композиционная «интересность» (не единая ровная сетка),
 * но без одного доминирующего перекошенного тайла. Полное покрытие проверено
 * суммой: колонки 38+26+36=100% ширины; внутри каждой из 2-й и 3-й — свои
 * 100% высоты. */
const DESKTOP_BENTO_SLOTS = [
  { top: "0%", left: "0%", width: "38%", height: "100%" },
  { top: "0%", left: "38%", width: "26%", height: "55%" },
  { top: "55%", left: "38%", width: "26%", height: "45%" },
  { top: "0%", left: "64%", width: "36%", height: "45%" },
  { top: "45%", left: "64%", width: "36%", height: "55%" },
] as const;

const CTA_PRIMARY = { label: "Смотреть календарь", href: "#tours" };
const CTA_SECONDARY = { label: "Наши ценности", href: "#values" };

const CTA_BASE =
  "inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-4 text-[12px] font-medium tracking-[0.01em] transition-colors duration-300 sm:h-14 sm:px-8 sm:text-sm sm:font-semibold sm:tracking-[0.03em] lg:h-14 lg:px-8 lg:text-sm lg:font-semibold lg:tracking-[0.03em]";

/** HERO подтягивается ВВЕРХ под шапку, чтобы занять честный полный экран.
 *
 * Шапка (`header.tsx`) — `sticky top-0`, а sticky-элемент занимает своё место в
 * потоке документа. Из-за этого HERO начинался под шапкой и при высоте `100svh`
 * вылезал за низ экрана ровно на её высоту: срезало кнопки, полоска-подсказка
 * уходила за экран. Вычитать высоту шапки — плохой вариант: «первый экран» тогда
 * не полноэкранный, сверху остаётся полоса другого цвета.
 *
 * Решение: отрицательный отступ на высоту шапки — секция начинается в самом
 * верху экрана и занимает ровно `100svh`. Шапка (z-50) лежит поверх HERO и на
 * самом верху страницы прозрачна, проявляясь при скролле — см. `header.tsx`,
 * атрибут `data-hero-fullscreen` ниже включает этот режим.
 *
 * `--header-height` проставляет сам `header.tsx` через ResizeObserver — одно
 * значение на оба брейкпоинта, поэтому и отступ здесь один; фолбэк 64px (моб.
 * `h-16`) нужен только на первый кадр до гидратации.
 *
 * `svh` (не `vh`) на мобильной — `vh` на телефоне считается по экрану БЕЗ учёта
 * адресной строки, из-за чего низ уезжает под неё. */
const PULL_UNDER_HEADER = "calc(-1 * var(--header-height, 64px))";

export function HeroSectionFullscreenV4({ hero }: HeroSectionFullscreenV4Props) {
  const mobilePhotos = (hero?.photos ?? []).slice(0, MOBILE_BENTO_SLOTS.length);
  const desktopPhotos = (hero?.photos ?? []).slice(0, DESKTOP_BENTO_SLOTS.length);

  return (
    // `all` — полноэкранный HERO и на мобильной, и на десктопе.
    // Отрицательный отступ — на САМОЙ секции, а не на внутреннем блоке: у секции
    // `overflow-hidden`, и поднятый внутренний блок ею же и обрезался — сверху
    // оставалась светлая полоса фона секции вместо фото.
    <section
      id="hero"
      data-hero-fullscreen="all"
      className="relative w-full overflow-hidden bg-background"
      style={{ marginTop: PULL_UNDER_HEADER }}
    >
      {/* ---------- Мобильный первый экран (<lg) — как в версии 3, без изменений ---------- */}
      <div className="relative h-[100svh] w-full overflow-hidden lg:hidden">
        {mobilePhotos.length > 0 && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            {mobilePhotos.map((photo, index) => {
              const slot = MOBILE_BENTO_SLOTS[index];
              return (
                <div
                  key={photo?._key ?? index}
                  className="hero-photo-in absolute overflow-hidden"
                  style={{
                    top: slot.top,
                    left: slot.left,
                    width: slot.width,
                    height: slot.height,
                    animationDelay: `${150 + index * 100}ms`,
                  }}
                >
                  <div
                    className="hero-kenburns relative h-full w-full"
                    style={{ animationDelay: `${index * 500}ms` }}
                  >
                    {/* Плитки коллажа занимают 42–58% ширины на мобильном и
                        26–38% на десктопе — без `sizes` браузер считал бы их во
                        всю ширину окна и тянул 3840px-вариант на каждую из пяти. */}
                    <SanityImage
                      image={photo}
                      fill
                      sizes="(max-width: 1023px) 60vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to top, var(--color-foreground) 0%, rgb(from var(--color-foreground) r g b / 0.62) 26%, rgb(from var(--color-foreground) r g b / 0.08) 52%, rgb(from var(--color-foreground) r g b / 0) 68%)",
          }}
          aria-hidden="true"
        />

        {/* `pb-24` — под полоску-подсказку, которая лежит абсолютом у самого низа:
            при меньшем отступе она налезала на кнопки. */}
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 pt-24">
          {hero?.eyebrow && (
            <p className="hero-fade-up max-w-[260px] text-[12px] font-medium uppercase leading-[1.35] tracking-[0.18em] text-background">
              {hero.eyebrow}
            </p>
          )}

          {hero?.heading && (
            <h1
              className="hero-fade-up mt-4 font-heading text-[38px] leading-[0.95] text-background"
              style={{ animationDelay: "120ms" }}
            >
              {hero.heading}
            </h1>
          )}

          {(hero?.subheading || hero?.subheadingAccent) && (
            <p
              className="hero-fade-up mt-3 font-heading text-[24px] leading-[1.1] text-background"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subheading}
              {hero.subheading && hero.subheadingAccent ? " " : null}
              {hero.subheadingAccent && <em className="italic">{hero.subheadingAccent}</em>}
            </p>
          )}

          <div
            className="hero-fade-up mt-8 flex flex-row flex-wrap items-center gap-2"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href={CTA_PRIMARY.href}
              className={cn(CTA_BASE, "border border-background bg-background text-foreground")}
            >
              {CTA_PRIMARY.label}
            </Link>
            <Link
              href={CTA_SECONDARY.href}
              className={cn(
                CTA_BASE,
                "border border-background/70 bg-transparent text-background hover:bg-background hover:text-foreground"
              )}
            >
              {CTA_SECONDARY.label}
            </Link>
          </div>
        </div>

        {/* Пиновано отдельно от текстового блока (`absolute`, не в потоке) — см.
            пояснение в hero-section-fullscreen.tsx (тот же приём, тот же баг).
            Родитель — `min-h`, не фиксированная высота: если контент когда-нибудь
            станет выше экрана, секция вырастет, а не обрежет кнопки снизу
            (так и было раньше при `h-[100svh]` + `overflow-hidden` — обрезало). */}
        <div
          className="hero-scroll-cue pointer-events-none absolute inset-x-0 z-10 mx-auto"
          style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
          aria-hidden="true"
        >
          <span />
        </div>
      </div>

      {/* ---------- Desktop (lg+) — новый полноэкранный bento, тот же язык, что у мобильной ---------- */}
      <div className="relative hidden h-screen w-full overflow-hidden lg:block">
        {desktopPhotos.length > 0 && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            {desktopPhotos.map((photo, index) => {
              const slot = DESKTOP_BENTO_SLOTS[index];
              return (
                <div
                  key={photo?._key ?? index}
                  className="hero-photo-in absolute overflow-hidden"
                  style={{
                    top: slot.top,
                    left: slot.left,
                    width: slot.width,
                    height: slot.height,
                    animationDelay: `${150 + index * 100}ms`,
                  }}
                >
                  <div
                    className="hero-kenburns relative h-full w-full"
                    style={{ animationDelay: `${index * 500}ms` }}
                  >
                    {/* Плитки коллажа занимают 42–58% ширины на мобильном и
                        26–38% на десктопе — без `sizes` браузер считал бы их во
                        всю ширину окна и тянул 3840px-вариант на каждую из пяти. */}
                    <SanityImage
                      image={photo}
                      fill
                      sizes="(max-width: 1023px) 60vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to top, var(--color-foreground) 0%, rgb(from var(--color-foreground) r g b / 0.6) 22%, rgb(from var(--color-foreground) r g b / 0.1) 44%, rgb(from var(--color-foreground) r g b / 0) 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-end px-8 pb-24 pt-32 text-center">
          {hero?.eyebrow && (
            <p className="hero-fade-up text-[15px] font-medium uppercase leading-[1.35] tracking-[0.18em] text-background">
              {hero.eyebrow}
            </p>
          )}

          {hero?.heading && (
            <h1
              className="hero-fade-up mt-6 max-w-[900px] font-heading text-[clamp(52px,5vw,72px)] leading-[0.95] text-background"
              style={{ animationDelay: "120ms" }}
            >
              {hero.heading}
            </h1>
          )}

          {(hero?.subheading || hero?.subheadingAccent) && (
            <p
              className="hero-fade-up mt-4 max-w-[680px] font-heading text-[clamp(24px,1.8vw,32px)] leading-[1.15] text-background"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subheading}
              {hero.subheading && hero.subheadingAccent ? " " : null}
              {hero.subheadingAccent && <em className="italic">{hero.subheadingAccent}</em>}
            </p>
          )}

          <div
            className="hero-fade-up mt-9 flex flex-row flex-nowrap items-center justify-center gap-6"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href={CTA_PRIMARY.href}
              className={cn(CTA_BASE, "border border-background bg-background text-foreground")}
            >
              {CTA_PRIMARY.label}
            </Link>
            <Link
              href={CTA_SECONDARY.href}
              className={cn(
                CTA_BASE,
                "border border-background/70 bg-transparent text-background hover:bg-background hover:text-foreground"
              )}
            >
              {CTA_SECONDARY.label}
            </Link>
          </div>
        </div>

        <div
          className="hero-scroll-cue pointer-events-none absolute inset-x-0 z-10 mx-auto"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
          aria-hidden="true"
        >
          <span />
        </div>
      </div>
    </section>
  );
}

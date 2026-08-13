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

interface HeroSectionFullscreenProps {
  hero?: HeroContent | null;
}

/**
 * v3 — новый компонент секции (см. docs/redesign/VERSIONS.md, правило
 * «не копировать код между версиями»: блок реально другой → новый файл,
 * `hero-section.tsx` не тронут).
 *
 * МЕНЯЕТСЯ ТОЛЬКО МОБИЛЬНАЯ ВЕРСТКА (<lg). Desktop-раскладка (коллаж +
 * текст-оверлей) скопирована из `hero-section.tsx` без изменений — тот же
 * `PHOTO_SLOTS`, те же классы, тот же порядок.
 *
 * Проблема, которую решает мобильный вариант: старый мобильный слой давал
 * radial-scrim в цвет фона поверх коллажа — по центру экрана было плоское
 * светлое пятно, а не цельная композиция.
 *
 * Новый подход: секция на весь экран (100svh), фото — полноэкранный
 * bento-коллаж на 4 карточки (не мелкие плавающие кластеры), поверх —
 * градиент затемнения снизу вверх (в foreground, не в background) под текст,
 * который лежит в нижней трети экрана. Фото получают лёгкий Ken Burns-зум.
 */

const PHOTO_SLOTS = [
  { left: "4.22%", top: "41.86%", width: "11.04%", height: "44.07%", opacity: 0.95, float: "9s" },
  { left: "12.55%", top: "22.88%", width: "8.33%", height: "27.8%", opacity: 1, float: "11s" },
  { left: "17.5%", top: "46.44%", width: "9.38%", height: "36.95%", opacity: 0.91, float: "10s" },
  { left: "73.75%", top: "43.56%", width: "11.15%", height: "35.42%", opacity: 0.9, float: "12s" },
  { left: "83.91%", top: "24.07%", width: "11.88%", height: "57.97%", opacity: 0.95, float: "8.5s" },
] as const;

/** Bento-раскладка на весь экран для мобильного full-bleed коллажа. Порядок =
 *  порядок фото в Sanity, столько слотов, сколько пришло фото (максимум 5).
 *
 * Левая колонка (58% ширины) закрыта полностью: 64% + 36% = 100% высоты.
 * Правая колонка (42% ширины) раньше закрывала только 38% + 40% = 78% —
 * снизу справа оставалась пустая полоса до конца экрана. Добавлен 5-й слот
 * (78–100%, те самые недостающие 22%), под него уже есть 5-е фото в Sanity —
 * десктопный коллаж (`PHOTO_SLOTS`) использует все 5, мобильный до этого брал
 * только 4. */
const MOBILE_BENTO_SLOTS = [
  { top: "0%", left: "0%", width: "58%", height: "64%" },
  { top: "0%", left: "58%", width: "42%", height: "38%" },
  { top: "38%", left: "58%", width: "42%", height: "40%" },
  { top: "64%", left: "0%", width: "58%", height: "36%" },
  { top: "78%", left: "58%", width: "42%", height: "22%" },
] as const;

const CTA_PRIMARY = { label: "Смотреть календарь", href: "#tours" };
const CTA_SECONDARY = { label: "Наши ценности", href: "#values" };

const CTA_BASE =
  "inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-4 text-[12px] font-medium tracking-[0.01em] transition-colors duration-300 sm:h-14 sm:px-8 sm:text-sm sm:font-semibold sm:tracking-[0.03em]";


export function HeroSectionFullscreen({ hero }: HeroSectionFullscreenProps) {
  const photos = (hero?.photos ?? []).slice(0, PHOTO_SLOTS.length);
  const mobilePhotos = (hero?.photos ?? []).slice(0, MOBILE_BENTO_SLOTS.length);

  return (
    // `mobile` — в этой версии полноэкранный только мобильный HERO, десктоп
    // остался прежним баннером, поэтому шапку прячем лишь на узких экранах.
    <section
      id="hero"
      data-hero-fullscreen="mobile"
      /* Сдвиг — на самой секции (её `overflow-hidden` обрезал бы поднятый
         внутренний блок) и только `<lg` — на десктопе тут прежний баннер.
         Класс записан целиком, не собран через `${}`: Tailwind ищет классы
         статическим сканированием исходников и интерполированный не найдёт. */
      className="relative w-full overflow-hidden bg-background max-lg:mt-[calc(-1*var(--header-height,64px))]"
    >
      {/* ---------- Мобильный первый экран (<lg) ---------- */}
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
                    {/* Bento-слоты — 42–58% ширины экрана (MOBILE_BENTO_SLOTS выше). */}
                    <SanityImage image={photo} fill sizes="60vw" className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Затемнение снизу вверх — в foreground, не в background: полноценный
            контраст под текстом, фото остаются яркими и видны почти целиком. */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to top, var(--color-foreground) 0%, rgb(from var(--color-foreground) r g b / 0.62) 26%, rgb(from var(--color-foreground) r g b / 0.08) 52%, rgb(from var(--color-foreground) r g b / 0) 68%)",
          }}
          aria-hidden="true"
        />

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

        {/* Пиновано отдельно от текстового блока абсолютным позиционированием —
            раньше полоска шла в общем потоке после кнопок (`mt-9`), и на любом
            экране, где текст занимал чуть больше места, уезжала за нижний край
            вместе с остальным контентом. `min-h` (не фиксированная `h-`) —
            специально: секция должна МОЧЬ вырасти выше экрана, если контент не
            влезает, а не обрезать его через `overflow-hidden` (так было при
            попытке зафиксировать `h-[100svh]` — кнопки снизу срезало). В обычном
            случае (короткий текст) секция ровно в экран, и полоска у истинного
            низа; `safe-area-inset-bottom` — чтобы не упереться в чёлку/индикатор
            жестов на телефоне. */}
        <div
          className="hero-scroll-cue pointer-events-none absolute inset-x-0 z-10 mx-auto"
          style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
          aria-hidden="true"
        >
          <span />
        </div>
      </div>

      {/* ---------- Desktop (lg+) — без изменений, копия из hero-section.tsx ---------- */}
      <div className="relative isolate mx-auto hidden w-full lg:block lg:aspect-[1920/590] lg:max-w-[1920px]">
        {photos.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
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
                    {/* Слоты коллажа — 8–12% ширины экрана (PHOTO_SLOTS выше), десктоп-only. */}
                    <SanityImage image={photo} fill sizes="15vw" className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center lg:absolute lg:inset-0 lg:justify-start lg:py-0 lg:pt-[clamp(40px,4.2708vw,82px)]">
          {hero?.eyebrow && (
            <p className="hero-fade-up max-w-none text-[15px] font-medium uppercase leading-[1.35] tracking-[0.18em] text-primary lg:whitespace-nowrap">
              {hero.eyebrow}
            </p>
          )}

          {hero?.heading && (
            <h1
              className="hero-fade-up mt-6 max-w-[885px] font-heading text-[38px] leading-[0.95] text-primary lg:mt-[clamp(32px,4.7917vw,92px)] lg:text-[clamp(52px,3.125vw,60px)] lg:leading-[0.85]"
              style={{ animationDelay: "120ms" }}
            >
              {hero.heading}
            </h1>
          )}

          {(hero?.subheading || hero?.subheadingAccent) && (
            <p
              className="hero-fade-up mt-4 max-w-[674px] font-heading text-[24px] leading-[1.1] text-primary lg:mt-[clamp(0px,0.5208vw,10px)] lg:text-[clamp(34px,2.34375vw,45px)] lg:leading-[0.78]"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subheading}
              {hero.subheading && hero.subheadingAccent ? " " : null}
              {hero.subheadingAccent && <em className="italic">{hero.subheadingAccent}</em>}
            </p>
          )}

          <div
            className="hero-fade-up mt-9 flex flex-row flex-nowrap items-center justify-center gap-[clamp(24px,2.2917vw,44px)] lg:mt-[clamp(36px,3.4375vw,66px)]"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href={CTA_PRIMARY.href}
              className={cn(CTA_BASE, "border border-primary bg-primary text-on-primary hover:bg-primary-dark")}
            >
              {CTA_PRIMARY.label}
            </Link>
            <Link
              href={CTA_SECONDARY.href}
              className={cn(
                CTA_BASE,
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

import Link from "next/link";
import { HERO, HERO_PHOTOS } from "./content";

/**
 * Два концепта мобильного HERO для превью-песочницы `/stitch-preview/hero`.
 *
 * Общая идея обоих: убрать конкуренцию текста и фото, из-за которой заказчик
 * забраковал текущую версию (текст лежал поверх краёв пяти кадров сразу).
 * Цвета — только токены из `@theme`; полупрозрачные оттенки берём через
 * relative color syntax `rgb(from var(--color-…) r g b / a)`, как уже сделано
 * в `hero-section.tsx` — новых hex не вводим.
 */

const CTA =
  "inline-flex h-14 w-full items-center justify-center rounded-full text-[14px] font-semibold tracking-[0.03em] transition-colors duration-300";

/** Кнопки: основная — заливка primary, вторичная — обводка. Обе на всю ширину. */
function HeroCtas({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="mt-8 flex w-full flex-col gap-3">
      <Link
        href={HERO.ctaPrimary.href}
        className={`${CTA} border border-primary bg-primary text-on-primary hover:bg-primary-dark`}
      >
        {HERO.ctaPrimary.label}
      </Link>
      <Link
        href={HERO.ctaSecondary.href}
        className={
          onDark
            ? `${CTA} border border-on-primary/60 bg-transparent text-on-primary hover:bg-on-primary hover:text-primary`
            : `${CTA} border border-primary bg-transparent text-primary hover:bg-primary hover:text-on-primary`
        }
      >
        {HERO.ctaSecondary.label}
      </Link>
    </div>
  );
}

/**
 * Вариант A — «полноэкранный иммерсивный».
 * Один сильный вертикальный кадр на всю высоту экрана (100svh), текст сидит в
 * нижней трети на градиенте, который к низу доходит до чистого `--color-background`.
 * Это ровно то, что просил заказчик («хочу посмотреть полноэкранный герой»):
 * фото читается как фото, текст — как текст, пересечения нет.
 */
export function HeroVariantA() {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-background">
      <img
        src={HERO_PHOTOS.tall}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
      />

      {/* Скрим: лёгкое затемнение сверху (под эйбрау), прозрачность в центре, к низу — фон сайта */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom," +
            " rgb(from var(--color-foreground) r g b / 0.58) 0%," +
            " rgb(from var(--color-foreground) r g b / 0.28) 18%," +
            " rgb(from var(--color-foreground) r g b / 0) 30%," +
            " rgb(from var(--color-background) r g b / 0) 40%," +
            " rgb(from var(--color-background) r g b / 0.88) 60%," +
            " var(--color-background) 74%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-5 pb-10 pt-[104px]">
        <p className="max-w-[300px] text-[11px] font-medium uppercase leading-[1.5] tracking-[0.16em] text-on-primary">
          {HERO.eyebrow}
        </p>

        <div className="mt-auto">
          <h1 className="font-heading text-[44px] leading-[0.98] text-primary">{HERO.heading}</h1>
          <p className="mt-4 max-w-[330px] font-heading text-[22px] leading-[1.15] text-text-deep">
            {HERO.subheading} <em className="italic">{HERO.subheadingAccent}</em>
          </p>
          <HeroCtas />
        </div>
      </div>
    </section>
  );
}

/**
 * Вариант B — «редакторский сплит».
 * Фото занимает верхние ~58% экрана и мягко растворяется в фоне, текст живёт
 * ниже на чистом фоне. Максимальная читаемость: текст вообще не лежит на фото.
 * Под подзаголовком — узкая лента из трёх остальных кадров, чтобы сохранить
 * ощущение коллажа из десктопной версии, но без каши.
 */
export function HeroVariantB() {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-background">
      <div className="relative h-[58svh] w-full shrink-0">
        <img
          src={HERO_PHOTOS.wide}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[50%_32%]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, rgb(from var(--color-background) r g b / 0) 0%, var(--color-background) 88%)",
          }}
        />
        {/* верхний скрим — иначе эйбрау теряется на светлом кадре */}
        <div
          className="absolute inset-x-0 top-0 h-[34%]"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, rgb(from var(--color-foreground) r g b / 0.58) 0%, rgb(from var(--color-foreground) r g b / 0) 100%)",
          }}
        />
        <p className="absolute inset-x-5 top-[92px] text-[11px] font-medium uppercase leading-[1.5] tracking-[0.16em] text-on-primary">
          {HERO.eyebrow}
        </p>
      </div>

      <div className="relative -mt-14 flex flex-1 flex-col px-5 pb-10">
        <h1 className="font-heading text-[42px] leading-[0.98] text-primary">{HERO.heading}</h1>
        <p className="mt-4 max-w-[330px] font-heading text-[21px] leading-[1.15] text-text-deep">
          {HERO.subheading} <em className="italic">{HERO.subheadingAccent}</em>
        </p>

        {/* лента-«напоминание» о коллаже */}
        <div className="mt-7 flex gap-2" aria-hidden="true">
          {[HERO_PHOTOS.cliffs, HERO_PHOTOS.ocean, HERO_PHOTOS.tall].map((src) => (
            <div key={src} className="h-[74px] flex-1 overflow-hidden rounded-lg">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <HeroCtas />
      </div>
    </section>
  );
}

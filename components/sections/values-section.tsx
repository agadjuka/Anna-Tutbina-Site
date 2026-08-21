import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface ValuesItem {
  title?: string;
  text?: string;
}

interface ValuesContent {
  eyebrow?: string;
  heading?: string;
  backgroundImage?: any;
  backgroundImageRight?: any;
  items?: ValuesItem[];
}

interface ValuesSectionProps {
  values?: ValuesContent | null;
}

/** В макете фон секции — два разных фото по половинам (ноды 26:38 слева и «IMG_0766 3»
 * справа, ~968 из 1921px каждое), не одно растянутое на всю ширину.
 *
 * ⚠️ Раньше здесь был единый `BACKGROUND_ASPECT_RATIO = 968/996` (≈0.97, почти квадрат)
 * для обоих фото — из-за этого Sanity заранее обрезала оба портретных фото (0.75 и 0.82)
 * под почти квадратную форму, а `object-cover` в браузере обрезал результат ЕЩЁ РАЗ под
 * реальный контейнер (высота которого зависит от контента и на десктопе выходит ближе
 * к ~0.68 — уже, а не почти квадрат). Двойная обрезка обрезала девушкам лица — с этим
 * багом уже разбирались в CALENDAR (см. `docs/redesign/blocks.md`, блок 3). Фикс тот же:
 * просить Sanity отдать фото БЕЗ навязанного кропа (родная пропорция), обрезку до формы
 * контейнера делает только `object-cover`, один раз. */

export function ValuesSection({ values }: ValuesSectionProps) {
  const items = values?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section id="values" className="relative overflow-hidden bg-primary py-16 lg:py-24">
      {values?.backgroundImage?.asset && (
        <div className="absolute inset-y-0 left-0 w-1/2">
          <SanityImage
            image={values.backgroundImage}
            fill
            aspectRatio={474 / 632}
            alt=""
            className="object-cover opacity-45"
          />
        </div>
      )}
      {values?.backgroundImageRight?.asset && (
        <div className="absolute inset-y-0 right-0 w-1/2">
          <SanityImage
            image={values.backgroundImageRight}
            fill
            aspectRatio={984 / 1200}
            alt=""
            className="object-cover opacity-45"
          />
        </div>
      )}

      <Container className="relative">
        <div className="text-center">
          {values?.eyebrow && (
            <SectionEyebrow className="text-background">
              {values.eyebrow}
            </SectionEyebrow>
          )}
          {values?.heading && (
            <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-background sm:text-[40px] lg:text-[clamp(40px,2.8vw,54px)]">
              {values.heading}
            </h2>
          )}
        </div>

        {/*
          Мобильная раскладка (<640px) — компактная сетка 2×3 вместо одной длинной
          колонки из 6 карточек (см. `docs/redesign/backlog.md` п.6): читаемо, но не
          растягивает секцию на весь скролл. С `sm` и выше — прежний размер карточек
          и десктопная сетка 3×2 не тронуты.
        */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-x-[91px] lg:gap-y-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl bg-background px-4 pt-6 pb-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] sm:rounded-[24px] sm:px-9 sm:pt-8 sm:pb-11"
            >
              {/* Заливной кружок с номером. Размер задаём через `size-N` (а не отдельными
                  утилитами высоты и ширины) — так они гарантированно совпадают и круг не
                  превращается в овал. `leading-none` убирает лишний межстрочный интервал
                  курсивной Cormorant, из-за которого цифра вставала не по центру.
                  Без `overflow-hidden` — он обрезал цифру на мобильном. */}
              <div className="mx-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-primary sm:size-12">
                <span className="font-heading text-[15px] italic leading-none text-on-primary sm:text-[17px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {item.title && (
                <p className="mt-3 font-heading text-[16px] leading-tight text-foreground sm:mt-4 sm:text-[25px] sm:leading-normal">
                  {item.title}
                </p>
              )}
              {item.text && (
                <p className="mt-2 text-[12.5px] font-light leading-[1.35] text-text-deep sm:mt-3 sm:text-[17px] sm:leading-[1.3]">
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

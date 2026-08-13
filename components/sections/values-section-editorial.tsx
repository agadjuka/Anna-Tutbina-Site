import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { Reveal } from "@/components/ui/reveal";

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

interface ValuesSectionEditorialProps {
  values?: ValuesContent | null;
}

/**
 * v3 — новый компонент секции (не копия `values-section.tsx`, десктоп и данные
 * не менялись). Меняется только мобильная (<sm) подача 6 пунктов.
 *
 * Было: сетка 2×3 карточек-плашек (белая заливка, тень, скругления) — читалось
 * как обычный список фич.
 * Стало: редакционный вертикальный список — крупный тонкий номер, заголовок,
 * текст, тонкая линия-разделитель, без заливки/теней. Появление по одному при
 * скролле через уже существующий `<Reveal>` (переиспользован, не написан заново).
 *
 * Sm и выше — прежняя сетка 3×2 карточек, один в один как в `values-section.tsx`.
 */
export function ValuesSectionEditorial({ values }: ValuesSectionEditorialProps) {
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
            <p className="text-[15px] font-medium uppercase tracking-[0.18em] text-background">
              {values.eyebrow}
            </p>
          )}
          {values?.heading && (
            <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-background sm:text-[40px] lg:text-[clamp(40px,2.8vw,54px)]">
              {values.heading}
            </h2>
          )}
        </div>

        {/* Мобильный редакционный список (<sm) */}
        <div className="mt-10 flex flex-col sm:hidden">
          {items.map((item, index) => (
            <Reveal key={index} delayMs={index * 70}>
              <div
                className={
                  index === 0
                    ? "flex gap-4 py-5"
                    : "flex gap-4 border-t border-background/25 py-5"
                }
              >
                <span className="font-heading text-[28px] italic leading-none text-background/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  {item.title && (
                    <p className="font-heading text-[19px] leading-tight text-background">
                      {item.title}
                    </p>
                  )}
                  {item.text && (
                    <p className="mt-2 text-[13px] font-light leading-[1.4] text-background/75">
                      {item.text}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Sm и выше — прежняя сетка карточек, без изменений */}
        <div className="mt-10 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-x-[91px] lg:gap-y-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl bg-background px-9 pt-8 pb-11 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] sm:rounded-[24px]"
            >
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <span className="font-heading text-[17px] italic leading-none text-on-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {item.title && (
                <p className="mt-4 font-heading text-[25px] leading-normal text-foreground">
                  {item.title}
                </p>
              )}
              {item.text && (
                <p className="mt-3 text-[17px] font-light leading-[1.3] text-text-deep">
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

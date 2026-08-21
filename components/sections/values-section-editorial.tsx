import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { Reveal } from "@/components/ui/reveal";
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
    /* Высота, отступы и сетка сняты с узлов Figma (секция `5:73`, 1921×1020):
       эйбрау y=58, заголовок y=119 (интерлиньяж 50), сетка карточек с y=246,
       карточка 400×268, зазоры 91×81, ширина сетки 1382 (x 269…1651).
       Разбор — `docs/redesign/client-feedback-2026-08.md`. */
    <section id="values" className="relative overflow-hidden bg-primary py-16 lg:min-h-[min(53.1vw,1020px)] lg:py-0">
      {/* `data-static-photo` — эти фото приглушены постоянным `opacity-45` на
          самой картинке; в v6 общая анимация появления фото (`v6ImageIn`,
          globals.css) без этого атрибута анимирует opacity к 1 и в конце
          резко «роняет» его обратно до 0.45 без перехода. См. пояснение
          в globals.css рядом с правилом `[data-static-photo] img`. */}
      {/* Кадр фоновых фото — ровно из макета (узлы `26:38` и `26:48`), а не
          `object-cover`. В Figma слои сдвинуты: левый на −38.52% вверх и на
          −6.92% влево, правый на −16.41% вверх. Из-за центрирования `cover`
          у нас было видно середину кадра (песок), а в макете — лица девушек
          слева и бегущая девушка справа. Пропорции ассетов (474×632 и 984×1200)
          совпадают с боксами макета один в один, поэтому кадр повторяется точно.

          Приглушение 45% — на ОБЁРТКЕ, а не на картинке: так «фильтр» не может
          отвалиться от фото, даже если картинку анимируют (v6ImageIn анимирует
          именно `opacity` у `img`). Плюс `data-static-photo` по-прежнему
          исключает фото из общей анимации появления. */}
      {values?.backgroundImage?.asset && (
        <div
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden opacity-45"
          data-static-photo=""
        >
          <SanityImage
            image={values.backgroundImage}
            fill
            sizes="50vw"
            figmaCrop={{ width: 106.92, height: 138.57, left: -6.92, top: -38.52 }}
            alt=""
            className="object-cover"
          />
        </div>
      )}
      {values?.backgroundImageRight?.asset && (
        <div
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden opacity-45"
          data-static-photo=""
        >
          <SanityImage
            image={values.backgroundImageRight}
            fill
            sizes="50vw"
            figmaCrop={{ width: 107.91, height: 125.92, left: 0.21, top: -16.41 }}
            alt=""
            className="object-cover"
          />
        </div>
      )}

      {/* `size="wide"` + ограничение сетки 1375px — ширина сетки карточек из
          макета. С общим контейнером 1280px карточки выходили уже и выше макета
          (340×310 против 395×278), и тот же текст занимал 5–6 строк вместо
          четырёх. Правка заказчика, см. `docs/redesign/client-feedback-2026-08.md`
          пп. 3.4. */}
      <Container size="wide" className="relative lg:pt-[min(3.02vw,58px)]">
        <div className="text-center">
          {values?.eyebrow && (
            <SectionEyebrow className="text-background">
              {values.eyebrow}
            </SectionEyebrow>
          )}
          {values?.heading && (
            <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-background sm:text-[40px] lg:mt-[min(2.13vw,41px)] lg:text-[clamp(40px,2.81vw,54px)] lg:leading-[min(2.6vw,50px)]">
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
                {/* Тот же прозрачный кружок, что на десктопе (правка заказчика
                    2026-08-20) — только на оливковом фоне, поэтому обводка и
                    цифра светлые. Размер меньше: 40px против 44px, чтобы не
                    перевешивать заголовок пункта на узком экране. */}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-background/70 font-heading text-[15px] italic leading-none text-background">
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

        {/* Sm и выше — сетка карточек.

            2026-08-21, правка заказчика «карточки чуть-чуть поменьше, чтобы всё
            пропорционально уменьшилось, карточка вместе»: все размеры этого
            блока умножены на 0.9 — ширина сетки, зазоры, поля, кружок, кегли.
            Именно ОДИН И ТОТ ЖЕ множитель на ширину карточки и на кегль текста
            принципиален: тогда число строк внутри карточки не меняется. Если
            ужать только ширину, текст поедет в 5–6 строк и упрётся в нижнюю
            кромку — ровно та жалоба, которую чинили раньше (п. 11.6 в
            `docs/redesign/client-feedback-2026-08.md`).

            Исходные (=макетные) значения на 1920px, если понадобится вернуть:
            сетка 1382, зазоры 91×81, карточка min-h 268, поля 35/34/64,
            кружок 44 и 16px, заголовок 25px, текст 17px. */}
        <div className="mt-10 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:mx-auto lg:mt-[min(3.6vw,69px)] lg:max-w-[min(79.2vw,1244px)] lg:grid-cols-3 lg:gap-x-[min(4.27vw,82px)] lg:gap-y-[min(3.8vw,73px)]">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl bg-background px-8 pt-7 pb-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] sm:rounded-[24px] lg:min-h-[min(12.56vw,241px)] lg:px-[min(1.64vw,32px)] lg:pb-[min(3vw,58px)] lg:pt-[min(1.59vw,31px)]"
            >
              {/* Кружок с номером — в макете это слой «Border»: прозрачный, с
                  обводкой `1px #69695c`, 44×44, радиус 22 (то есть круг), номер
                  внутри — Cormorant Garamond Italic 16px. Раньше был залитый
                  primary-кружок 48px со светлой цифрой — правка заказчика
                  2026-08-20: «прозрачный кружок и в мобильной, и в десктопной».
                  С 2026-08-21 уменьшен вместе со всей карточкой: 40px / 14px. */}
              <div className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-primary">
                <span className="font-heading text-[14px] italic leading-[25px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {item.title && (
                <p className="mt-4 font-heading text-[22px] leading-normal text-foreground lg:mt-[9px] lg:text-[clamp(18px,1.17vw,22.5px)] lg:leading-[1.47]">
                  {item.title}
                </p>
              )}
              {item.text && (
                <p className="mt-3 text-[15px] font-light leading-[1.35] text-text-deep lg:mt-[min(1.17vw,22.5px)] lg:px-0 lg:text-[clamp(13px,0.8vw,15.3px)] lg:leading-[1.29]">
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

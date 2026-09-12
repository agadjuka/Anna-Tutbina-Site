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

interface ValuesSectionProps {
  values?: ValuesContent | null;
}

/**
 * Блок «Почему нас выбирают» боевой главной.
 *
 * От `sm` — сетка 3×2 карточек, как в макете. На мобильном (<sm) — редакционный
 * вертикальный список: крупный тонкий номер, заголовок, текст, тонкая линия
 * вместо карточек с заливкой и тенями; пункты появляются по одному при
 * прокрутке через общий `<Reveal>`.
 *
 * Файл назывался `values-section-editorial.tsx`, пока рядом жила прежняя
 * версия секции; 12.09.2026 та удалена вместе с системой версий, и имя
 * освободилось.
 */
export function ValuesSection({ values }: ValuesSectionProps) {
  const items = values?.items ?? [];
  if (items.length === 0) return null;

  return (
    /* Высота, отступы и сетка сняты с узлов Figma (секция `5:73`, 1921×1020):
       эйбрау y=58, заголовок y=119 (интерлиньяж 50), сетка карточек с y=246,
       карточка 400×268, зазоры 91×81, ширина сетки 1382 (x 269…1651).
       Разбор — `docs/redesign/client-feedback-2026-08.md`. */
    <section id="values" className="relative overflow-hidden bg-primary py-16 lg:pb-[calc(39*var(--ona-u))] lg:pt-0">
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
          исключает фото из общей анимации появления.

          ⚠️ У правого слоя `left` = −0.5, а не снятые с макета +0.21. Плюсовое
          смещение уводило картинку ВПРАВО от кромки своей половины: при 1920
          это 2px, где не нарисовано ничего, и сквозь них просвечивал фон
          секции — по всей высоте блока шла вертикальная линия. Заказчик её и
          заметил («съехали фотки и между ними образовалась линия»). Минус
          даёт нахлёст внутрь (обёртка `overflow-hidden`, лишнее срезается),
          поэтому шва не будет ни на какой ширине окна, включая дробные. */}
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
            figmaCrop={{ width: 107.91, height: 125.92, left: -0.5, top: -16.41 }}
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
      {/* Отступ сверху до надзаголовка = отступу от карточек до низа (39 при
          1280): заказчик 08.09 отметил галочками ровно эти два расстояния.
          `min-height` у секции нет — высоту задаёт контент. */}
      <Container size="wide" className="relative lg:pt-[calc(39*var(--ona-u))]">
        <div className="text-center">
          {values?.eyebrow && (
            <SectionEyebrow className="text-background">
              {values.eyebrow}
            </SectionEyebrow>
          )}
          {values?.heading && (
            <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-background sm:text-[33px] lg:mt-[calc(15*var(--ona-u))] lg:text-[calc(24.46*var(--ona-u))] lg:leading-[calc(22.63*var(--ona-u))]">
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
        <div className="mt-10 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:mx-auto lg:mt-[calc(25.34*var(--ona-u))] lg:max-w-[calc(729.91*var(--ona-u))] lg:grid-cols-3 lg:gap-x-[calc(30.06*var(--ona-u))] lg:gap-y-[calc(26.75*var(--ona-u))]">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl bg-background px-8 pt-7 pb-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] sm:rounded-[24px] lg:min-h-[calc(102.09*var(--ona-u))] lg:px-[calc(13.33*var(--ona-u))] lg:pb-[calc(24.38*var(--ona-u))] lg:pt-[calc(12.92*var(--ona-u))]"
            >
              {/* Кружок с номером — в макете это слой «Border»: прозрачный, с
                  обводкой `1px #69695c`, 44×44, радиус 22 (то есть круг), номер
                  внутри — Cormorant Garamond Italic 16px. Раньше был залитый
                  primary-кружок 48px со светлой цифрой — правка заказчика
                  2026-08-20: «прозрачный кружок и в мобильной, и в десктопной».
                  С 2026-08-21 уменьшен вместе со всей карточкой: 40px / 14px. */}
              <div className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-primary lg:size-[calc(28*var(--ona-u))]">
                <span className="font-heading text-[14px] italic leading-[25px] text-primary lg:text-[calc(13*var(--ona-u))] lg:leading-[min(1.3vw,25px)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {item.title && (
                <p className="mt-4 font-heading text-[22px] leading-normal text-foreground lg:mt-[calc(3.31*var(--ona-u))] lg:text-[calc(11*var(--ona-u))] lg:leading-[1.47]">
                  {item.title}
                </p>
              )}
              {item.text && (
                <p className="mt-3 text-[15px] font-light leading-[1.35] text-text-deep lg:mt-[calc(8.24*var(--ona-u))] lg:px-0 lg:text-[calc(11*var(--ona-u))] lg:leading-[1.29]">
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

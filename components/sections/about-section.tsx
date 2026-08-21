import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface AboutContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photos?: any[];
}

interface AboutSectionProps {
  about?: AboutContent | null;
}

/* Якорь на секцию этой же страницы — см. пояснение в hero-section.tsx */
const CTA = { label: "Наши ценности", href: "#values" };

export function AboutSection({ about }: AboutSectionProps) {
  if (!about) return null;

  const mainPhoto = about.photos?.[0];
  const decorPhoto = about.photos?.[1];

  return (
    <section id="about" className="relative w-full overflow-hidden bg-primary">
      {/* Высота секции — `min-height` из макета (922 при 1921 = 48% ширины), а не
          жёсткий `aspect-ratio`. С жёсткой пропорцией на 1280 и ниже текст (у него
          есть нижние границы размеров) переставал помещаться в кадр и наезжал на
          кнопку. `min-h` держит пропорцию макета там, где текст влезает, и даёт
          секции подрасти там, где нет. Потолок 922px — чтобы на мониторах шире
          1921px секция не раздувалась вместе с `vw`. */}
      <div className="flex flex-col lg:mx-auto lg:min-h-[min(48vw,922px)] lg:max-w-[1921px] lg:flex-row">
        <div className="relative h-[70vh] max-h-[520px] w-full sm:h-[80vh] sm:max-h-[640px] lg:h-auto lg:max-h-none lg:w-[45%]">
          {mainPhoto ? (
            <SanityImage
              image={mainPhoto}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
              alt=""
            />
          ) : (
            <div className="absolute inset-0 bg-primary-dark" />
          )}
        </div>

        {/* Отступы в процентах считаются от ширины РОДИТЕЛЯ-строки (1921), а не самой
              панели — поэтому 5.03%, а не 9.35%: текст в макете начинается на x=961,
              фото занимает 45%, значит от левого края строки это 50.03%. */}
          <div className="relative flex flex-1 items-center overflow-hidden px-6 py-14 sm:px-10 md:px-16 lg:flex-col lg:items-stretch lg:justify-between lg:px-0 lg:pb-[min(3.18vw,61px)] lg:pl-[5.03%] lg:pr-[2.2%] lg:pt-[min(2.97vw,57px)]">
          {/* Декоративный «цветок» (Figma 20:15). Бокс — ровно как в макете:
              736×981 при секции 1921×922, прижат к правому краю секции, сверху
              выходит за неё на 59px, снизу заканчивается по кромке. Ассет в
              Sanity ровно 736×981 — то есть это тот же слой один в один, и
              `object-contain` показывает цветок целиком, а не кусок.
              Было `-right-1/4 -top-1/4 h-[140%] w-[90%] object-cover`: картинка
              раздувалась и уезжала за правый край — заказчик это и увидел
              («выглядит крупно, целиком не влазит»). */}
          {decorPhoto && (
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/4 h-[140%] w-[90%] overflow-hidden rounded-[10%] opacity-[0.12] sm:opacity-[0.15] lg:right-0 lg:top-[-6.4%] lg:h-[106.4%] lg:w-[69.5%] lg:rounded-none"
              aria-hidden="true"
            >
              <SanityImage
                image={decorPhoto}
                fill
                sizes="(max-width: 1023px) 90vw, 40vw"
                className="object-cover lg:object-contain lg:object-right-top"
                alt=""
              />
            </div>
          )}

          {/* ДЕСКТОП — раскладка снята с узлов Figma (секция `5:20`, 1921×922),
              а не подобрана на глаз. Координаты в макете → доли секции:
              текст начинается на x=961 (9.35% ширины панели), эйбрау — вверху
              (y≈57 = 6.2%), заголовок y=137 (14.9%), абзацы y=378 (41%),
              кнопка y=803 (87.1%). Поэтому колонка позиционируется абсолютно
              по этим долям, а не центрируется по высоте: в макете текст
              занимает почти всю высоту панели, а не стоит компактным блоком
              посередине.

              Размеры — тоже из макета (сняты `get_design_context` с узлов
              `18:2` и `5:27`), с потолком в px на 1920 и в `vw` ниже, чтобы блок
              пропорционально ужимался на 1440/1280:
              заголовок **80px / высота строки 65px** (то есть 0.8125, а не 0.9 —
              раньше кегль был занижен до 72px и буквы выходили на 12% уже макета),
              абзацы **27px / 35px**. Межбуквенного интервала в макете нет —
              глобальный `tracking-tight` с заголовков снят в globals.css.

              ⚠️ Начертания у нас проектные, а не из макета (правило
              `docs/redesign/README.md`): в Figma заголовок набран Cormorant
              **Unicase**, абзацы — **Manrope**. У нас Cormorant и Gilroy Light.
              По ширине строки расхождение после правки кегля ~1.5%, но рисунок
              букв отличается — если нужно один в один, это отдельное решение
              заказчика по шрифтам.

              МОБИЛЬНАЯ — как была: обычный поток, по центру. */}
          <div className="relative z-10 mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:max-w-none lg:text-left">
            {about.eyebrow && (
              <SectionEyebrow className="text-on-primary/90">
                {about.eyebrow}
              </SectionEyebrow>
            )}

            {about.heading && (
              /* `max-w` держит разбивку макета «ИСКУССТВО / ПУТЕШЕСТВОВАТЬ /
                 КРАСИВО»: он уже, чем «ПУТЕШЕСТВОВАТЬ КРАСИВО» одной строкой,
                 но шире самого длинного слова. */
              <h2 className="mt-4 font-heading text-[34px] uppercase leading-[0.95] text-on-primary sm:text-[44px] lg:mt-[min(3.1vw,60px)] lg:max-w-[min(41.7vw,800px)] lg:text-[min(4.17vw,80px)] lg:leading-[0.8125]">
                {about.heading}
              </h2>
            )}

            {about.body && (
              <PortableTextContent
                value={about.body}
                className="mt-6 space-y-5 text-[16px] leading-[1.5] text-on-primary/90 sm:text-[18px] lg:mt-[min(2.5vw,48px)] lg:max-w-[min(29.2vw,560px)] lg:space-y-[min(2.24vw,43px)] lg:text-[clamp(12px,1.4vw,27px)] lg:leading-[1.296]"
              />
            )}

            {/* На мобильной кнопка идёт следом за текстом, на десктопе она
                вынесена из потока и стоит на своей отметке 87.1% — см. ниже. */}
            <Link
              href={CTA.href}
              className="mt-9 inline-flex h-12 items-center justify-center rounded-full border border-on-primary px-7 text-[13px] font-semibold tracking-[0.02em] text-on-primary transition-colors duration-300 hover:bg-on-primary hover:text-primary lg:hidden"
            >
              {CTA.label}
            </Link>
          </div>

          {/* Кнопка десктопа. Прижата к низу панели (`justify-between` выше) —
              в макете её низ на y=861 из 922, то есть в 61px от нижней кромки.
              Ширина 221.66px из макета: она заметно шире, чем «по содержимому». */}
          <Link
            href={CTA.href}
            className="z-10 hidden h-[clamp(48px,3vw,58px)] w-[min(11.55vw,222px)] shrink-0 items-center justify-center self-start rounded-full border border-on-primary text-[13px] font-semibold tracking-[0.02em] text-on-primary transition-colors duration-300 hover:bg-on-primary hover:text-primary lg:inline-flex"
          >
            {CTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

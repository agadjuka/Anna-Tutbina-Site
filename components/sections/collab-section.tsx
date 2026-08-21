import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { ContactCta } from "@/components/ui/contact-cta";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface CollabContent {
  eyebrow?: string;
  homeHeading?: string;
  homeHeadingAccent?: string;
  homeDescription?: any;
  images?: any[];
  tags?: string[];
}

interface ContactItem {
  label?: string;
  url?: string;
  icon?: string;
}

interface CollabSectionProps {
  collab?: CollabContent | null;
  primaryContacts?: ContactItem[];
  /**
   * Декоративный «цветок» в левом верхнем углу зелёной подложки — есть в макете,
   * на сайте его не было (замечание заказчика, см.
   * `docs/redesign/client-feedback-2026-08.md`, п. 3.7).
   *
   * Приходит пропом, а не из `collab.images`, намеренно: в Sanity у `customTour`
   * лежит одна картинка (фото справа), а тот же самый ассет-цветок уже загружен
   * для блока ABOUT (`homePage.about.photos[1]`) — это графика из одного и того
   * же узла макета. Переиспользуем её, чтобы не заводить ради декора новое поле
   * схемы и не грузить второй раз тот же файл. Если заказчик захочет здесь
   * ДРУГОЙ цветок — тогда и появится отдельное поле в `customTour`.
   */
  decorPhoto?: any;
}

const CTA_LABEL = "Обсудить идею";

export function CollabSection({ collab, primaryContacts = [], decorPhoto }: CollabSectionProps) {
  if (!collab) return null;

  const photo = collab.images?.[0];

  return (
    <section id="collab" className="relative w-full overflow-hidden bg-primary">
      {/* `items-stretch` (по умолчанию), а не `items-center`: с центрированием
          фото высотой 743px висело по центру секции с полями сверху и снизу,
          а в макете оно вплотную к краям. Правка заказчика, см.
          `docs/redesign/client-feedback-2026-08.md` п. 3.7. */}
      {/* `min-h`, а не `aspect-ratio`: с жёсткой пропорцией теги внизу вылезали
          за кромку секции и обрезались `overflow-hidden` (та же грабля, что в ABOUT). */}
      <div className="flex flex-col lg:mx-auto lg:min-h-[min(38.7vw,743px)] lg:max-w-[1920px] lg:flex-row">
        {/* Раскладка снята с узлов Figma (секция `5:253`, 1920×743): эйбрау y=65,
            заголовок y=85 (50px/59), абзацы y=239 и y=381 (шириной 510),
            кнопка y=553 (189×57.6), теги y=661. Текст начинается на x=204 —
            это 21.1% ширины ПАНЕЛИ (967px), а не 10.6% ширины секции:
            процентные отступы считаются от родителя, легко ошибиться вдвое. */}
        <div className="relative order-2 flex flex-1 items-center px-6 py-14 text-center sm:px-10 md:px-16 lg:order-1 lg:items-start lg:px-0 lg:pt-[min(3.39vw,65px)] lg:text-left">
          {/* Цветок из макета: прижат к левому верхнему углу и намеренно
              срезается краями секции (у секции `overflow-hidden`), как нарисовано.
              Только на десктопе — на мобильной панель узкая, декор превращается
              в грязное пятно за текстом. */}
          {decorPhoto?.asset && (
            <div
              className="pointer-events-none absolute -left-[13%] top-0 hidden h-full w-[79%] opacity-[0.13] lg:block"
              aria-hidden="true"
            >
              <SanityImage
                image={decorPhoto}
                fill
                sizes="30vw"
                className="object-contain object-left"
                alt=""
              />
            </div>
          )}
          <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-[21.1%] lg:mr-[3%] lg:max-w-[min(37vw,711px)]">
            {collab.eyebrow && (
              <SectionEyebrow className="text-background">
                {collab.eyebrow}
              </SectionEyebrow>
            )}

            {(collab.homeHeading || collab.homeHeadingAccent) && (
              <h2 className="mt-4 font-heading text-[34px] uppercase leading-[0.95] text-background lg:mt-0 lg:text-[clamp(44px,2.6vw,50px)] lg:leading-[min(3.07vw,59px)]">
                {collab.homeHeading}{" "}
                {collab.homeHeadingAccent && (
                  <em className="font-heading italic">{collab.homeHeadingAccent}</em>
                )}
              </h2>
            )}

            {collab.homeDescription && (
              <PortableTextContent
                value={collab.homeDescription}
                className="mt-6 space-y-4 text-[16px] leading-[1.5] text-background sm:text-[18px] lg:mt-[min(1.88vw,36px)] lg:max-w-[min(26.6vw,510px)] lg:space-y-[min(1.77vw,34px)] lg:text-[clamp(18px,1.41vw,27px)] lg:leading-[min(1.82vw,35px)]"
              />
            )}

            {/* Раскрывает реальные контакты вместо перехода на /custom-tour: там нет
                никакого способа связаться, и путь пользователя упирался в тупик. */}
            <ContactCta label={CTA_LABEL} contacts={primaryContacts} className="mt-9 lg:mt-[min(3.33vw,64px)]" />

            {/* Теги — один ряд от `sm` и выше (правка заказчика: в макете это
                один ряд, а у нас на 1285 было 3+1). Кегль и зазоры ужимаются
                вместе с экраном: 15px и 24px при 1920 — как в макете.

                НА ТЕЛЕФОНЕ РЯД ПЕРЕНОСИТСЯ. Раньше `flex-nowrap` стоял на всех
                ширинах, и четыре русские фразы физически не влезали в 320–390px:
                кегль ужимался до 10px, зазор — до 8px, точки-разделители
                прятались, и теги читались слипшимися («Дни рожденияДевичники»),
                а на 320–360px ряд ещё и вылезал за края экрана (первый тег
                начинался с x = −14). Замечание заказчика 2026-08-21.
                Теперь ниже `sm` — перенос по словам, зазор 12px и кегль 12px;
                требование «в одну строку» остаётся там, где строка вмещается.

                Точки-разделители по-прежнему только от `sm`: на перенесённом
                ряду точка в конце строки читается как опечатка. */}
            {collab.tags && collab.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 whitespace-nowrap text-[12px] tracking-[0.02em] text-background/80 sm:flex-nowrap sm:gap-x-[clamp(8px,1.25vw,24px)] sm:gap-y-0 sm:text-[clamp(12px,0.78vw,15px)] lg:mt-[min(2.6vw,50px)] lg:justify-start">
                {collab.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-x-[clamp(8px,1.25vw,24px)]">
                    <span>{tag}</span>
                    {index < collab.tags!.length - 1 && (
                      <span aria-hidden="true" className="hidden text-background/40 sm:inline">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* `data-static-photo` — см. пояснение в globals.css у правила
            `[data-static-photo] img`: фото приглушено постоянным `opacity-55`,
            общая v6-анимация появления фото с этим не совместима. */}
        <div
          className="relative order-1 h-[55vh] max-h-[420px] w-full self-stretch opacity-55 sm:h-[65vh] sm:max-h-[520px] lg:order-2 lg:h-auto lg:max-h-none lg:w-[49.6%]"
          data-static-photo=""
        >
          {photo?.asset ? (
            <SanityImage
              image={photo}
              fill
              aspectRatio={953 / 743}
              className="object-cover"
              alt=""
            />
          ) : (
            <div className="absolute inset-0 bg-primary-dark" />
          )}
        </div>
      </div>
    </section>
  );
}

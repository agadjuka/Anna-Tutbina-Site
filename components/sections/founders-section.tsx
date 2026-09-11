import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { FoundersDiptych } from "@/components/sections/founders-diptych";
import type { FoundersContent } from "@/lib/home-data";

interface FoundersSectionProps {
  founders?: FoundersContent | null;
}

/* Якорь на секцию этой же страницы — см. пояснение в hero-section.tsx */
const CTA = { label: "Наши ценности", href: "#values" };

export function FoundersSection({ founders }: FoundersSectionProps) {
  if (!founders) return null;

  const links = founders.links ?? [];
  const hasPeople = Boolean(founders.founderOne?.name || founders.founderTwo?.name);

  return (
    <section id="founders" className="relative w-full overflow-hidden bg-primary">
      {/* Верхняя панель снята с узла `57:282` (1920×828): фото слева 1006 (52.4%;
          с 11.09.2026 — ровно 50%, чтобы стык фото/панель стоял на центральной
          оси страницы под стыком текст/коллаж в GUESTS — просьба заказчика),
          текст с x=1101 — это 10.4% ширины ПРАВОЙ панели, эйбрау y=69,
          заголовок y=117 (53px/50), текст y=335 (27px/35, колонка 489),
          кнопка y=692 (221.66×57.63). `min-h`, а не `aspect` — см. ABOUT. */}
      <div className="flex flex-col lg:mx-auto lg:min-h-[min(43.1vw,828px)] lg:max-w-[1920px] lg:flex-row">
        {/* `data-static-photo` — см. пояснение в globals.css у правила
            `[data-static-photo] img`: фото приглушено постоянным `opacity-60`,
            общая v6-анимация появления фото с этим не совместима. */}
        <div
          className="relative h-[60vh] max-h-[440px] w-full self-stretch opacity-60 sm:h-[70vh] sm:max-h-[560px] lg:h-auto lg:max-h-none lg:w-1/2"
          data-static-photo=""
        >
          {founders.photo?.asset ? (
            <SanityImage
              image={founders.photo}
              fill
              aspectRatio={1006 / 828}
              /* Кадр — по центру по вертикали (умолчание Sanity: исходник
                 2304×4096, кадр под пропорцию макета 2304×1897, срезается
                 поровну сверху и снизу). Пробовали держать за нижнюю кромку
                 (`cropAnchor="bottom"`) — заказчик выбрал центр. */
              className="object-cover"
              alt=""
            />
          ) : (
            <div className="absolute inset-0 bg-primary-dark" />
          )}
        </div>

        <div className="relative flex flex-1 items-center px-6 py-14 sm:px-10 md:px-16 lg:items-start lg:px-0 lg:pt-[min(3.59vw,69px)]">
          <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-[10.4%] lg:mr-[6%] lg:max-w-[min(38vw,583px)]">
            {founders.eyebrow && (
              <SectionEyebrow className="text-center text-subtle lg:text-left">
                {founders.eyebrow}
              </SectionEyebrow>
            )}

            {founders.heading && (
              <h2 className="mt-4 text-center font-heading text-[34px] uppercase leading-[0.95] text-background lg:mt-[min(1.46vw,28px)] lg:text-left lg:text-[min(2.76vw,53px)] lg:leading-[min(2.6vw,50px)]">
                {founders.heading}
              </h2>
            )}

            {founders.body && (
              <PortableTextContent
                value={founders.body}
                className="mt-6 space-y-4 text-center text-[16px] leading-[1.5] text-background sm:text-[18px] lg:mt-[min(3.54vw,68px)] lg:max-w-[min(25.5vw,489px)] lg:space-y-[min(1.82vw,35px)] lg:text-left lg:text-[clamp(12px,1.41vw,27px)] lg:leading-[min(1.82vw,35px)]"
              />
            )}

            <div className="mt-9 flex flex-col items-center gap-6 lg:mt-[min(2.6vw,50px)] lg:flex-row lg:items-center lg:justify-start lg:gap-9">
              <Link
                href={CTA.href}
                className="inline-flex h-12 items-center justify-center rounded-full border border-background px-7 text-[13px] font-semibold tracking-[0.02em] text-background transition-colors duration-300 hover:bg-background hover:text-primary lg:h-[clamp(48px,3vw,58px)] lg:w-[min(11.55vw,222px)] lg:px-0"
              >
                {CTA.label}
              </Link>

              {links.length > 0 && (
                <div className="flex items-center gap-6">
                  {links.map((link, index) =>
                    link.url ? (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-background pb-0.5 text-[13px] font-semibold text-background transition-opacity duration-300 hover:opacity-70"
                      >
                        {link.label || "Instagram →"}
                      </a>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*
        Диптих «Создатели проекта» — с 11.09.2026 по макету заказчика от 07.09
        (вместо двух фото-«лепестков» с текстом под ними;
        `docs/redesign/client-feedback-2026-09-11.md`, п. 1). Числа при 1280:

          надзаголовок по центру, 49 от верха → фото с y=114;
          два фото 325×420 ВПЛОТНУЮ, стык ровно по центру страницы;
          текст по бокам в колонках 210 с зазором 36 до фото: слева выключен
          вправо, справа — влево; внизу подпись в две строки, 47 до низа.

        Сетка на десктопе — четыре колонки «текст | фото | фото | текст»;
        разметка персоны (фото + текст) одна на обе раскладки, на десктопе её
        обёртка растворяется (`lg:contents`). Всё поведение «Читать дальше» —
        в `founders-diptych.tsx`.
        Фон темнее верхней панели — как в макете (≈ #57574B → `primary-dark`).
      */}
      {hasPeople && (
        <div className="relative bg-primary-dark px-6 pb-16 pt-14 sm:px-10 lg:px-0 lg:pb-[calc(44*var(--ona-u,1px))] lg:pt-[calc(44*var(--ona-u,1px))]">
          {/* Содержимое — не шире 1280 × множитель: выше 1920 множитель
              перестаёт расти, и без потолка сетка и надзаголовок жили бы на
              всю ширину окна (аудит `audit-scale.mjs` ловил это на 2560).
              ⚠️ Именно `max-w`, а не `w`: `--ona-u` считается от `100vw`,
              ВМЕСТЕ с полосой прокрутки, а центрирование — по ширине без неё.
              С `w-[1280u]` блок на Windows вылезал на ширину полосы (15–17px)
              и стык фото уезжал вправо от центра страницы на ~8px. */}
          <div className="lg:mx-auto lg:max-w-[calc(1280*var(--ona-u,1px))]">
            {founders.eyebrow && (
              <SectionEyebrow className="text-center text-subtle">{founders.eyebrow}</SectionEyebrow>
            )}

            <FoundersDiptych
              founderOne={founders.founderOne}
              founderTwo={founders.founderTwo}
              caption={founders.diptychCaption}
            />
          </div>
        </div>
      )}
    </section>
  );
}

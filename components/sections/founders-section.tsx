import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface FoundersLink {
  label?: string;
  url?: string;
}

interface FounderPerson {
  photo?: any;
  name?: string;
  role?: string;
  description?: string;
}

interface FoundersContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photo?: any;
  links?: FoundersLink[];
  founderOne?: FounderPerson;
  founderTwo?: FounderPerson;
}

interface FoundersSectionProps {
  founders?: FoundersContent | null;
}

/* Якорь на секцию этой же страницы — см. пояснение в hero-section.tsx */
const CTA = { label: "Наши ценности", href: "#values" };

/**
 * Форма фото создателей — «лепесток» из Figma (`5:248`). Радиусы заданы в
 * процентах от сторон, поэтому форма одинаковая на любой ширине контейнера
 * (та же техника, что и коллаж в GUESTS).
 *
 * В макете у двух персон формы разные — приведены к одной по просьбе заказчика:
 * разные асимметричные «кляксы» рядом читались как ошибка вёрстки, а не как приём.
 */
const FOUNDER_PHOTO_SHAPE =
  "rounded-tl-[71%] rounded-tr-[26%] rounded-br-[72%] rounded-bl-[25%]";

function FounderCard({ person }: { person?: FounderPerson }) {
  if (!person?.name) return null;

  return (
    <figure className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
      <div
        className={cn(
          "relative aspect-[3/4] w-full max-w-[240px] overflow-hidden sm:max-w-[300px] lg:aspect-[343/457] lg:max-w-[min(17.9vw,343px)]",
          FOUNDER_PHOTO_SHAPE
        )}
      >
        {person.photo?.asset ? (
          <SanityImage
            image={person.photo}
            fill
            aspectRatio={3 / 4}
            className="object-cover"
            alt={person.name}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-subtle-border via-primary to-text-deep" />
        )}
      </div>

      <figcaption className="mt-6 lg:mt-[min(1.15vw,22px)]">
        <p className="font-heading text-[24px] italic leading-tight text-background sm:text-[26px] lg:text-[min(1.82vw,35px)] lg:leading-[min(2.28vw,43.75px)]">
          {person.name}
        </p>
        {person.role && (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-subtle sm:text-[11.5px] lg:mt-[min(1.04vw,20px)] lg:text-[clamp(12px,0.68vw,13px)]">
            {person.role}
          </p>
        )}
        {person.description && (
          <p className="mx-auto mt-4 max-w-[320px] text-[14.5px] font-light leading-[1.6] text-background/90 lg:mx-0 lg:mt-[min(1.3vw,25px)] lg:max-w-[min(24.7vw,475px)] lg:text-[clamp(12px,0.885vw,17px)] lg:leading-[1.65]">
            {person.description}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export function FoundersSection({ founders }: FoundersSectionProps) {
  if (!founders) return null;

  const links = founders.links ?? [];
  const hasPeople = Boolean(founders.founderOne?.name || founders.founderTwo?.name);

  return (
    <section id="founders" className="relative w-full overflow-hidden bg-primary">
      {/* Верхняя панель снята с узла `57:282` (1920×828): фото слева 1006 (52.4%),
          текст с x=1101 — это 10.4% ширины ПРАВОЙ панели, эйбрау y=69,
          заголовок y=117 (53px/50), текст y=335 (27px/35, колонка 489),
          кнопка y=692 (221.66×57.63). `min-h`, а не `aspect` — см. ABOUT. */}
      <div className="flex flex-col lg:mx-auto lg:min-h-[min(43.1vw,828px)] lg:max-w-[1920px] lg:flex-row">
        {/* `data-static-photo` — см. пояснение в globals.css у правила
            `[data-static-photo] img`: фото приглушено постоянным `opacity-60`,
            общая v6-анимация появления фото с этим не совместима. */}
        <div
          className="relative h-[60vh] max-h-[440px] w-full self-stretch opacity-60 sm:h-[70vh] sm:max-h-[560px] lg:h-auto lg:max-h-none lg:w-[52.4%]"
          data-static-photo=""
        >
          {founders.photo?.asset ? (
            <SanityImage
              image={founders.photo}
              fill
              aspectRatio={1006 / 828}
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
        Нижняя лента: диптих создателей — отдельная секция в макете (`5:230`,
        1920×946). Колонки стоят на x=332 и x=1164 (то есть шириной 475 с
        зазором 357, вся полоса 1307), текст выключен влево, фото 343×457,
        имя с y=660, роль с y=723, текст с y=770. На мобильной — прежняя
        центрированная колонка.
      */}
      {hasPeople && (
        <div className="relative mx-auto w-full max-w-[1920px] px-6 sm:px-10 md:px-16 lg:px-0">
          <div className="border-t border-background/15 pb-16 pt-14 lg:border-t-0 lg:pb-[min(4.1vw,79px)] lg:pt-[min(4.1vw,79px)]">
            {/* В макете диптих — отдельная секция со своим надзаголовком
                «создатели проекта» на y=79; фото начинаются с y=181. */}
            {founders.eyebrow && (
              <SectionEyebrow className="hidden text-center text-subtle lg:block">
                {founders.eyebrow}
              </SectionEyebrow>
            )}
            <div className="mx-auto grid max-w-[860px] grid-cols-1 justify-items-center gap-14 sm:grid-cols-2 sm:gap-10 lg:ml-[min(17.29vw,332px)] lg:mr-0 lg:mt-[min(4.27vw,82px)] lg:max-w-[min(68.1vw,1307px)] lg:grid-cols-[min(24.7vw,475px)_min(24.7vw,475px)] lg:justify-between lg:justify-items-start lg:gap-0">
              <FounderCard person={founders.founderOne} />
              <FounderCard person={founders.founderTwo} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

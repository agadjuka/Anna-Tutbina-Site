import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { cn } from "@/lib/utils";

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
    <figure className="flex w-full flex-col items-center text-center">
      <div
        className={cn(
          "relative aspect-[3/4] w-full max-w-[240px] overflow-hidden sm:max-w-[300px] lg:max-w-[380px]",
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

      <figcaption className="mt-6 lg:mt-8">
        <p className="font-heading text-[24px] italic leading-tight text-background sm:text-[26px] lg:text-[clamp(26px,1.7vw,32px)]">
          {person.name}
        </p>
        {person.role && (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-subtle sm:text-[11.5px]">
            {person.role}
          </p>
        )}
        {person.description && (
          <p className="mx-auto mt-4 max-w-[320px] text-[14.5px] font-light leading-[1.6] text-background/90">
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
      <div className="flex flex-col lg:mx-auto lg:aspect-[1920/828] lg:max-w-[1920px] lg:flex-row">
        {/* `data-static-photo` — см. пояснение в globals.css у правила
            `[data-static-photo] img`: фото приглушено постоянным `opacity-60`,
            общая v6-анимация появления фото с этим не совместима. */}
        <div
          className="relative h-[60vh] max-h-[440px] w-full sm:h-[70vh] sm:max-h-[560px] lg:h-auto lg:max-h-none lg:w-[52.4%]"
          data-static-photo=""
        >
          {founders.photo?.asset ? (
            <SanityImage
              image={founders.photo}
              fill
              aspectRatio={1006 / 828}
              className="object-cover opacity-60"
              alt=""
            />
          ) : (
            <div className="absolute inset-0 bg-primary-dark" />
          )}
        </div>

        <div className="relative flex flex-1 items-center px-6 py-14 sm:px-10 md:px-16 lg:px-0">
          <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-[8.3%] lg:mr-[14%] lg:max-w-[520px]">
            {founders.eyebrow && (
              <p className="text-center text-[13px] font-medium uppercase tracking-[0.18em] text-subtle lg:text-left">
                {founders.eyebrow}
              </p>
            )}

            {founders.heading && (
              <h2 className="mt-4 text-center font-heading text-[34px] uppercase leading-[0.95] text-background lg:mt-6 lg:text-left lg:text-[clamp(44px,4.1vw,53px)] lg:leading-[0.9]">
                {founders.heading}
              </h2>
            )}

            {founders.body && (
              <PortableTextContent
                value={founders.body}
                className="mt-6 space-y-4 text-center text-[16px] leading-[1.5] text-background sm:text-[18px] lg:mt-8 lg:text-left lg:text-[clamp(18px,1.4vw,27px)]"
              />
            )}

            <div className="mt-9 flex flex-col items-center gap-6 lg:mt-10 lg:flex-row lg:items-center lg:justify-start lg:gap-9">
              <Link
                href={CTA.href}
                className="inline-flex h-12 items-center justify-center rounded-full border border-background px-7 text-[13px] font-semibold tracking-[0.02em] text-background transition-colors duration-300 hover:bg-background hover:text-primary lg:h-[clamp(48px,3vw,58px)] lg:px-8"
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
        Нижняя лента: диптих создателей. Внешние отступы совпадают с текстовой
        колонкой верхней части (`lg:px-[8.3%]`), а тонкая линия сверху продолжает
        её сетку — так две части читаются как одна секция, а не как два блока,
        случайно оказавшихся на одном фоне.
      */}
      {hasPeople && (
        <div className="relative mx-auto w-full max-w-[1920px] px-6 sm:px-10 md:px-16 lg:px-[8.3%]">
          <div className="border-t border-background/15 pb-16 pt-14 lg:pb-24 lg:pt-20">
            <div className="mx-auto grid max-w-[860px] grid-cols-1 justify-items-center gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
              <FounderCard person={founders.founderOne} />
              <FounderCard person={founders.founderTwo} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

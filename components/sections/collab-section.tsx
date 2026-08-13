import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { ContactCta } from "@/components/ui/contact-cta";

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
}

const CTA_LABEL = "Обсудить идею";

export function CollabSection({ collab, primaryContacts = [] }: CollabSectionProps) {
  if (!collab) return null;

  const photo = collab.images?.[0];

  return (
    <section id="collab" className="relative w-full overflow-hidden bg-primary">
      <div className="flex flex-col lg:mx-auto lg:aspect-[1920/743] lg:max-w-[1920px] lg:flex-row lg:items-center">
        <div className="relative order-2 flex flex-1 items-center px-6 py-14 text-center sm:px-10 md:px-16 lg:order-1 lg:px-0 lg:text-left">
          <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-[10.6%] lg:mr-[6%] lg:max-w-[560px]">
            {collab.eyebrow && (
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-background">
                {collab.eyebrow}
              </p>
            )}

            {(collab.homeHeading || collab.homeHeadingAccent) && (
              <h2 className="mt-4 font-heading text-[34px] uppercase leading-[0.95] text-background lg:mt-6 lg:text-[clamp(44px,2.6vw,50px)] lg:leading-[1.1]">
                {collab.homeHeading}{" "}
                {collab.homeHeadingAccent && (
                  <em className="font-heading italic">{collab.homeHeadingAccent}</em>
                )}
              </h2>
            )}

            {collab.homeDescription && (
              <PortableTextContent
                value={collab.homeDescription}
                className="mt-6 space-y-4 text-[16px] leading-[1.5] text-background sm:text-[18px] lg:mt-8 lg:text-[clamp(18px,1.4vw,27px)]"
              />
            )}

            {/* Раскрывает реальные контакты вместо перехода на /custom-tour: там нет
                никакого способа связаться, и путь пользователя упирался в тупик. */}
            <ContactCta label={CTA_LABEL} contacts={primaryContacts} className="mt-9 lg:mt-10" />

            {collab.tags && collab.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5 text-[13px] tracking-[0.02em] text-background/80 lg:mt-9 lg:justify-start lg:gap-x-6 lg:text-[15px]">
                {collab.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-x-3 lg:gap-x-6">
                    <span className="whitespace-nowrap">{tag}</span>
                    {index < collab.tags!.length - 1 && (
                      <span aria-hidden="true" className="text-background/40">
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
          className="relative order-1 h-[55vh] max-h-[420px] w-full sm:h-[65vh] sm:max-h-[520px] lg:order-2 lg:h-full lg:max-h-none lg:w-[49.6%]"
          data-static-photo=""
        >
          {photo?.asset ? (
            <SanityImage
              image={photo}
              fill
              aspectRatio={953 / 743}
              className="object-cover opacity-55"
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

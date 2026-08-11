import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";

interface AboutContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photos?: any[];
}

interface AboutSectionProps {
  about?: AboutContent | null;
}

const CTA = { label: "Наши ценности", href: "/#values" };

export function AboutSection({ about }: AboutSectionProps) {
  if (!about) return null;

  const mainPhoto = about.photos?.[0];
  const decorPhoto = about.photos?.[1];

  return (
    <section id="about" className="relative w-full overflow-hidden bg-primary">
      <div className="flex flex-col lg:aspect-[1921/922] lg:flex-row">
        <div className="relative h-[70vh] max-h-[520px] w-full sm:h-[80vh] sm:max-h-[640px] lg:h-auto lg:max-h-none lg:w-[45%]">
          {mainPhoto ? (
            <SanityImage image={mainPhoto} fill className="object-cover" alt="" />
          ) : (
            <div className="absolute inset-0 bg-primary-dark" />
          )}
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden px-6 py-14 sm:px-10 md:px-16 lg:px-0">
          {/* Декоративный акцент из макета (Figma 20:15) — приглушённая графика за текстом */}
          {decorPhoto && (
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/4 h-[140%] w-[90%] overflow-hidden rounded-[10%] opacity-[0.12] sm:opacity-[0.15]"
              aria-hidden="true"
            >
              <SanityImage image={decorPhoto} fill className="object-cover" alt="" />
            </div>
          )}

          <div className="relative z-10 mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:ml-[8.3%] lg:mr-[16%] lg:max-w-[520px] lg:text-left">
            {about.eyebrow && (
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-on-primary/90">
                {about.eyebrow}
              </p>
            )}

            {about.heading && (
              <h2 className="mt-4 font-heading text-[34px] uppercase leading-[0.95] text-on-primary sm:text-[44px] lg:mt-6 lg:text-[4.1vw] lg:leading-[0.9]">
                {about.heading}
              </h2>
            )}

            {about.body && (
              <PortableTextContent
                value={about.body}
                className="mt-6 space-y-5 text-[16px] leading-[1.5] text-on-primary/90 sm:text-[18px] lg:mt-8 lg:text-[1.2vw]"
              />
            )}

            <Link
              href={CTA.href}
              className="mt-9 inline-flex h-12 items-center justify-center rounded-full border border-on-primary px-7 text-[13px] font-semibold tracking-[0.02em] text-on-primary transition-colors duration-300 hover:bg-on-primary hover:text-primary lg:mt-10 lg:h-[3vw] lg:px-8"
            >
              {CTA.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

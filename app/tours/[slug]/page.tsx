import { sanityClient } from "@/lib/sanity.client";
import { tourBySlugQuery, tourMetadataQuery } from "@/lib/sanity.queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TourGallery } from "@/components/sections/tour-gallery";
import { ProgramDaysCarousel } from "@/components/sections/program-days-carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Тур не найден",
      description: "Запрашиваемый тур не найден",
    };
  }

  const tour = await sanityClient.fetch<{ name?: string; shortDescription?: string } | null>(
    tourMetadataQuery,
    { slug }
  );

  if (!tour || !tour.name) {
    return {
      title: "Тур не найден",
      description: "Запрашиваемый тур не найден",
    };
  }

  return {
    title: tour.name,
    description: tour.shortDescription || `Подробная информация о туре ${tour.name}`,
  };
}

interface Price {
  value: number;
  currency: string;
}

interface ProgramDay {
  dayTitle?: string;
  dayImage?: any[];
  dayDescription?: any;
}

interface TourData {
  _id: string;
  name: string;
  slug: { current: string };
  mainImage: any;
  overlayTitle?: any;
  introText?: any;
  gallery?: any[];
  fullProgram?: any;
  programByDays?: ProgramDay[];
  dates?: string;
  price?: Price;
}

export default async function TourPage({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const tour = await sanityClient.fetch<TourData | null>(tourBySlugQuery, { slug });

  if (!tour) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <Container>
        <div className="space-y-12 md:space-y-16">
          {(tour.dates || tour.price) && (
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#e5e0db]">
                {tour.dates && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base uppercase tracking-wider text-muted-foreground font-medium">Даты:</span>
                    <span className="text-lg md:text-2xl font-medium text-foreground">{tour.dates}</span>
                  </div>
                )}
                {tour.price && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-2xl md:text-3xl font-bold text-[#bea692]">
                      {tour.price.value} {tour.price.currency}
                    </span>
                  </div>
                )}
              </div>
            </header>
          )}

          {tour.mainImage && (
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <SanityImage
                image={tour.mainImage}
                width={1280}
                height={720}
                alt={tour.name}
                className="w-full h-auto object-cover"
              />
              {tour.overlayTitle && (
                <div className="absolute left-0 right-0 flex justify-center pointer-events-none" style={{ top: '70%' }}>
                  <div className="text-center px-4 md:px-8 max-w-full">
                    <PortableText
                      value={tour.overlayTitle}
                      components={{
                        block: {
                          normal: ({ children }) => (
                            <p 
                              className="text-white text-base md:text-lg lg:text-xl xl:text-2xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                              style={{ color: 'white' }}
                            >
                              {children}
                            </p>
                          ),
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tour.introText && (
            <section className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-4">
                  О туре
                </SectionHeading>
              </div>
              <div className="w-full flex justify-center">
                <div className="max-w-4xl w-full prose prose-lg">
                  <PortableTextContent 
                    value={tour.introText} 
                    className="text-base md:text-xl leading-relaxed text-muted-foreground" 
                  />
                </div>
              </div>
            </section>
          )}

          {tour.programByDays && tour.programByDays.length > 0 && (
            <section className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-6 md:mb-8">
                  Что нас ждет
                </SectionHeading>
              </div>
              <ProgramDaysCarousel days={tour.programByDays} />
            </section>
          )}

          {tour.fullProgram && (
            <section className="space-y-6 bg-white rounded-2xl p-8 md:p-12 shadow-card">
              <div className="relative">
                <SectionHeading as="h2" className="mb-4">
                  Полная программа тура
                </SectionHeading>
              </div>
              <div className="prose prose-lg max-w-none">
                <PortableTextContent 
                  value={tour.fullProgram} 
                  className="text-base md:text-xl leading-relaxed text-muted-foreground" 
                />
              </div>
            </section>
          )}

          {!!tour.gallery?.length && (
            <TourGallery images={tour.gallery!} tourName={tour.name} />
          )}
        </div>
      </Container>
    </main>
  );
}



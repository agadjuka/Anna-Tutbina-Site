import { sanityClient } from "@/lib/sanity.client";
import { tourBySlugQuery, tourMetadataQuery } from "@/lib/sanity.queries";
import { Heading } from "@/components/ui/heading";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

interface TourData {
  _id: string;
  name: string;
  slug: { current: string };
  mainImage: any;
  gallery?: any[];
  fullProgram?: any;
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
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          <header className="space-y-6">
            <div className="space-y-4">
              <span className="text-sm md:text-base uppercase tracking-wider text-[#bea692] font-medium block">
                Тур
              </span>
              <Heading as="h1" className="mb-0">{tour.name}</Heading>
            </div>
            {(tour.dates || tour.price) && (
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#e5e0db]">
                {tour.dates && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Даты:</span>
                    <span className="text-base font-medium text-foreground">{tour.dates}</span>
                  </div>
                )}
                {tour.price && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-base font-bold text-[#bea692] text-xl">
                      {tour.price.value} {tour.price.currency}
                    </span>
                  </div>
                )}
              </div>
            )}
          </header>

          {tour.mainImage && (
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <SanityImage
                image={tour.mainImage}
                width={1280}
                height={720}
                alt={tour.name}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {tour.fullProgram && (
            <section className="space-y-6 bg-white rounded-2xl p-8 md:p-12 shadow-card">
              <Heading as="h2" className="mb-0">Полная программа тура</Heading>
              <div className="prose prose-lg max-w-none">
                <PortableTextContent 
                  value={tour.fullProgram} 
                  className="text-base md:text-xl leading-relaxed text-muted-foreground" 
                />
              </div>
            </section>
          )}

          {!!tour.gallery?.length && (
            <section className="space-y-6">
              <Heading as="h2" className="mb-0">Галерея</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tour.gallery!.map((image, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300">
                    <SanityImage
                      image={image}
                      width={600}
                      height={400}
                      alt={`${tour.name} — фото ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </main>
  );
}



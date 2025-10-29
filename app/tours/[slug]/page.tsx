import { sanityClient } from "@/lib/sanity.client";
import { tourBySlugQuery } from "@/lib/sanity.queries";
import { Heading } from "@/components/ui/heading";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4">
        <Heading as="h1" className="text-4xl">{tour.name}</Heading>
        {(tour.dates || tour.price) && (
          <div className="flex flex-wrap gap-4 text-gray-700">
            {tour.dates && <span className="font-medium">{tour.dates}</span>}
            {tour.price && (
              <span className="font-bold">
                {tour.price.value} {tour.price.currency}
              </span>
            )}
          </div>
        )}
      </header>

      {tour.mainImage && (
        <SanityImage
          image={tour.mainImage}
          width={1280}
          height={720}
          alt={tour.name}
          className="w-full rounded-lg object-cover"
        />
      )}

      {tour.fullProgram && (
        <section className="space-y-4">
          <Heading as="h2" className="text-2xl">Полная программа тура</Heading>
          <PortableTextContent value={tour.fullProgram} />
        </section>
      )}

      {!!tour.gallery?.length && (
        <section className="space-y-4">
          <Heading as="h2" className="text-2xl">Галерея</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tour.gallery!.map((image, idx) => (
              <SanityImage
                key={idx}
                image={image}
                width={600}
                height={400}
                alt={`${tour.name} — фото ${idx + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />)
            )}
          </div>
        </section>
      )}
    </div>
  );
}



import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery } from "@/lib/sanity.queries";

type SanitySlug = { current: string };

interface SanityPrice {
  value: number;
  currency: string;
}

interface TourItem {
  _id: string;
  name: string;
  slug: SanitySlug;
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: SanityPrice;
}

export default async function HomePage() {
  const tours = await sanityClient.fetch<TourItem[]>(toursQuery);

  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="space-y-8">
          <Heading as="h2">Наши туры</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />)
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

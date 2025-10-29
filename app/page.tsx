import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, aboutQuery } from "@/lib/sanity.queries";
import { AboutSection } from "@/components/sections/about-section";

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
  const [tours, about] = await Promise.all([
    sanityClient.fetch<TourItem[]>(toursQuery),
    sanityClient.fetch<{ image: any; bio: any }>(aboutQuery),
  ]);

  return (
    <main className="min-h-screen py-8">
      {about && <AboutSection image={about.image} bio={about.bio} />}
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

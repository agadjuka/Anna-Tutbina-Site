import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { sanityClient } from "@/lib/sanity.client";
import { customTourQuery } from "@/lib/sanity.queries";

interface CustomTourDoc {
  title: string;
  mainImage?: any;
  description?: any;
}

export default async function CustomTourPage() {
  const data = await sanityClient.fetch<CustomTourDoc | null>(customTourQuery);

  if (!data) {
    return (
      <main className="py-16">
        <Container>
          <Heading as="h1">Индивидуальный тур</Heading>
          <p className="mt-4 text-zinc-500">Контент скоро будет.</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-16">
      <Container>
        <div className="space-y-8">
          <Heading as="h1">{data.title}</Heading>
          {data.mainImage?.asset && (
            <SanityImage image={data.mainImage} width={1600} height={900} className="w-full h-auto rounded-lg" alt={data.title} />
          )}
          {data.description && (
            <PortableTextContent value={data.description} />
          )}
        </div>
      </Container>
    </main>
  );
}



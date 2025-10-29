import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { sanityClient } from "@/lib/sanity.client";
import { customTourQuery } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Индивидуальный тур",
  description: "Создайте свой уникальный тур с Анной Турбиной. Индивидуальные программы и маршруты.",
};

interface CustomTourDoc {
  title: string;
  mainImage?: any;
  description?: any;
}

export default async function CustomTourPage() {
  const data = await sanityClient.fetch<CustomTourDoc | null>(customTourQuery);

  if (!data) {
    return (
      <main className="min-h-screen bg-background py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-sm md:text-base uppercase tracking-wider text-[#bea692] font-medium block">
              Индивидуальный тур
            </span>
            <Heading as="h1" className="mb-0">Индивидуальный тур</Heading>
            <p className="text-lg text-muted-foreground">Контент скоро будет.</p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-16 md:py-24">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          <div className="space-y-6">
            <span className="text-sm md:text-base uppercase tracking-wider text-[#bea692] font-medium block">
              Персональный маршрут
            </span>
            <Heading as="h1" className="mb-0">{data.title}</Heading>
          </div>
          {data.mainImage?.asset && (
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <SanityImage 
                image={data.mainImage} 
                width={1600} 
                height={900} 
                className="w-full h-auto object-cover" 
                alt={data.title} 
              />
            </div>
          )}
          {data.description && (
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-card">
              <div className="prose prose-lg max-w-none">
                <PortableTextContent 
                  value={data.description} 
                  className="text-base md:text-lg leading-relaxed text-muted-foreground" 
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}



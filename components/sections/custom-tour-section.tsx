"use client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.client";

interface CustomTourSectionProps {
  title: string;
  mainImage?: any;
}

export function CustomTourSection({ title, mainImage }: CustomTourSectionProps) {
  const bgUrl = mainImage?.asset
    ? urlFor(mainImage).width(2000).height(1200).quality(80).url()
    : undefined;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/50 to-[#1a1a1a]/60" />
      <Container>
        <div className="relative flex flex-col items-center justify-center text-center py-32 md:py-48 lg:py-56 gap-8">
          <div className="space-y-4">
            <span className="text-sm md:text-base uppercase tracking-wider text-white/80 font-medium block">
              Создайте свой тур
            </span>
            <Heading as="h2" className="text-white text-4xl md:text-6xl lg:text-7xl drop-shadow-lg mb-0">
              {title || "Индивидуальный тур"}
            </Heading>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Персональные маршруты, созданные специально для вас
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/custom-tour">Узнать подробнее</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}



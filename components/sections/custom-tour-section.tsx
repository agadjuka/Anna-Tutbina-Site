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
      className="relative w-full"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <Container>
        <div className="relative flex flex-col items-center justify-center text-center py-24 md:py-40 gap-6">
          <Heading as="h2" className="text-white drop-shadow-md">
            {title || "Индивидуальный тур"}
          </Heading>
          <Button asChild variant="secondary" className="backdrop-blur-sm">
            <Link href="/custom-tour">Узнать подробнее</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}



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
      {/* Градиентное наложение с градиентами */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/60 to-[#1a1a1a]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#bea692]/10 via-transparent to-[#bea692]/10" />
      
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/10 rounded-full hidden lg:block" />
      
      <Container>
        <div className="relative flex flex-col items-center justify-center text-center py-40 md:py-56 lg:py-72 gap-10">
          {/* Декоративная линия сверху */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-1 h-12 bg-white/30 rounded-full" />
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/90 font-medium">
                Создайте свой тур
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-white/30 to-transparent" />
            </div>
            
            <Heading as="h2" className="text-white text-4xl md:text-6xl lg:text-8xl drop-shadow-2xl mb-0 leading-[1.1]">
              {title || "Индивидуальный тур"}
            </Heading>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Персональные маршруты, созданные специально для вас
            </p>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="secondary" className="relative overflow-hidden">
              <Link href="/custom-tour" className="relative z-10">
                Узнать подробнее
              </Link>
            </Button>
          </div>
          
          {/* Декоративная линия снизу */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";

interface CustomTourSectionProps {
  title: string;
  mainImage?: any;
}

export function CustomTourSection({ title, mainImage }: CustomTourSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#bea692]/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e5e0db]/5 rounded-full blur-3xl" />
      
      <Container>
        <div className="relative flex flex-col items-center justify-center text-center py-20 md:py-28 lg:py-32 gap-8">
          <div className="space-y-6 w-full">
            <SectionHeading as="h2" className="mb-6">
              {title || "Индивидуальный тур"}
            </SectionHeading>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Персональные маршруты, созданные специально для вас
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="secondary" className="relative overflow-hidden">
              <Link href="/custom-tour" className="relative z-10">
                Узнать подробнее
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

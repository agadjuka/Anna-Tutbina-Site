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
      <Container>
        <div className="relative flex flex-col items-center justify-center text-center pt-10 md:pt-14 lg:pt-16 pb-5 md:pb-6 lg:pb-8 gap-5 md:gap-6">
          <div className="space-y-4 w-full">
            <SectionHeading as="h2" className="mb-4">
              {title || "Индивидуальный тур"}
            </SectionHeading>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Персональные маршруты, созданные специально для вас
              </p>
            </div>
          </div>
          
          <div className="mt-2 md:mt-3">
            <Button asChild variant="primary" className="relative overflow-hidden shadow-md">
              <Link
                href="/custom-tour"
                className="relative z-10 inline-flex items-center justify-center text-inherit"
              >
                Узнать подробнее
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

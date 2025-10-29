import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SanityImage } from "@/components/ui/sanity-image";
import { DecorativeBlur, DecorativeLine, DecorativeDot } from "@/components/ui/decorative-elements";
import { SectionHeading } from "@/components/ui/section-heading";

interface AboutSectionProps {
  image: any;
  bio: any;
}

export function AboutSection({ image, bio }: AboutSectionProps) {
  return (
    <section className="relative py-10 md:py-12 lg:py-16 bg-background overflow-hidden">
      {/* Декоративные элементы фона */}
      <DecorativeBlur className="top-20 left-10 w-96 h-96" />
      <DecorativeBlur className="bottom-20 right-10 w-80 h-80" />
      
      <Container>
        <div className="relative">
          {/* Декоративные элементы */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:block">
            <DecorativeDot className="w-3 h-3 mb-6" />
            <DecorativeLine className="w-16 h-px mb-4" />
            <DecorativeDot className="w-2 h-2" />
          </div>
          
          {/* Заголовок секции по центру */}
          <div className="mb-6 md:mb-8">
            <SectionHeading as="h1" className="mb-0">
              Обо мне
            </SectionHeading>
          </div>
          
          <div className="grid md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
            {/* Левая колонка - текст по центру */}
            <div className="space-y-8 relative z-10">
              <div className="relative pt-4">
                <div className="prose prose-lg max-w-none text-center mx-auto prose-p:text-center">
                  <PortableTextContent 
                    value={bio} 
                    className="text-base md:text-lg leading-[1.8] text-muted-foreground" 
                  />
                </div>
              </div>
            </div>
            
            {/* Правая колонка - изображение с нестандартным размещением */}
            <div className="relative mt-12 md:mt-0">
              {/* Декоративные элементы вокруг изображения */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-[#bea692]/20 rounded-full hidden md:block" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-[#e5e0db] rounded-full hidden lg:block" />
              
              <div className="relative">
                {/* Градиентный фон */}
                <div className="absolute -inset-8 bg-gradient-to-br from-[#bea692]/10 via-[#e5e0db]/20 to-transparent rounded-3xl blur-2xl" />
                
                {/* Основное изображение с асимметричным смещением */}
                <div className="relative transform rotate-[-1deg] md:rotate-1 hover:rotate-0 transition-transform duration-700">
                  <div className="absolute -inset-4 bg-white/80 rounded-2xl blur-xl" />
                  <div className="relative overflow-hidden rounded-2xl shadow-card-elevated">
                    <SanityImage
                      image={image}
                      alt="Анна Турбина"
                      className="w-full h-auto object-cover"
                      width={600}
                      height={800}
                    />
                  </div>
                </div>
                
                {/* Декоративный элемент сверху */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#bea692]/10 rounded-full blur-md hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}



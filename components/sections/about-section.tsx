import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SanityImage } from "@/components/ui/sanity-image";

interface AboutSectionProps {
  image: any;
  bio: any;
}

export function AboutSection({ image, bio }: AboutSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#bea692]/20 to-[#e5e0db]/30 rounded-3xl blur-xl"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <SanityImage
                image={image}
                alt="Анна Турбина"
                className="w-full h-auto object-cover"
                width={600}
                height={800}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm md:text-base uppercase tracking-wider text-[#bea692] font-medium mb-2 block">
                Познакомьтесь
              </span>
              <Heading as="h2" className="mb-0">Обо мне</Heading>
            </div>
            <div className="prose prose-lg max-w-none">
              <PortableTextContent 
                value={bio} 
                className="text-base md:text-lg leading-relaxed text-muted-foreground" 
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}



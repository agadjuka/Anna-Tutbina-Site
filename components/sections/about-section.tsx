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
    <section className="py-8 md:py-12">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <SanityImage
              image={image}
              alt="Фото"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div>
            <Heading as="h2" className="mb-4">Обо мне</Heading>
            <PortableTextContent value={bio} className="mb-6" />
            <a
              href="#"
              className="inline-block px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Читать далее
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}



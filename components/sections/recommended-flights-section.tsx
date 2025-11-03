import { SanityImage } from "@/components/ui/sanity-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { PortableTextContent } from "@/components/ui/portable-text";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";

interface RecommendedFlights {
  image?: any;
  text?: any;
}

interface RecommendedFlightsSectionProps {
  flights: RecommendedFlights;
}

export function RecommendedFlightsSection({ flights }: RecommendedFlightsSectionProps) {
  if (!flights || (!flights.image && !flights.text)) return null;

  return (
    <section className="space-y-6">
      <div className="relative">
        <SectionHeading as="h2" className="mb-6 md:mb-8">
          Рекомендованные рейсы
        </SectionHeading>
      </div>

      <div className="w-full space-y-6 md:space-y-8">
        {/* Изображение */}
        {flights.image && (
          <div className="relative group w-full">
            {/* Декоративные элементы */}
            <div className="absolute -inset-2 bg-gradient-to-br from-[#bea692]/10 via-[#e5e0db]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-2xl shadow-card border border-[#e5e0db] group-hover:border-[#bea692]/30 transition-all duration-500 w-full">
              {flights.image?.asset && (
                <img
                  src={urlFor(flights.image).width(4000).auto("format").quality(95).url()}
                  alt="Рекомендованные рейсы"
                  className="w-full h-auto block"
                  style={{ maxWidth: '100%' }}
                />
              )}
              
              {/* Легкий overlay при hover */}
              <div className="absolute inset-0 bg-[#bea692]/0 group-hover:bg-[#bea692]/5 transition-colors duration-500 pointer-events-none rounded-2xl" />
            </div>
          </div>
        )}

        {/* Текст */}
        {flights.text && (
          <div className="w-full flex justify-center">
            <div className="max-w-4xl w-full prose prose-lg max-w-none">
              <PortableTextContent 
                value={flights.text} 
                className="text-base md:text-lg leading-relaxed text-muted-foreground text-justify" 
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


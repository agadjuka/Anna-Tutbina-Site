import { SanityImage } from "@/components/ui/sanity-image";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Price {
  value: number;
  currency: string;
}

interface Tour {
  name: string;
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: Price;
  slug: { current: string };
}

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export function TourCard({ tour, className }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug.current}`}
      className={cn(
        "group block overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1",
        className
      )}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <SanityImage
          image={tour.mainImage}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          width={600}
          height={800}
          alt={tour.name}
        />
      </div>
      <div className="p-6 md:p-8 bg-white">
        <Heading as="h3" className="text-xl md:text-2xl mb-3 text-foreground group-hover:text-[#bea692] transition-colors duration-300">
          {tour.name}
        </Heading>
        <Paragraph className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
          {tour.shortDescription}
        </Paragraph>
        {(tour.dates || tour.price) && (
          <div className="mt-6 pt-6 border-t border-[#e5e0db] flex items-center justify-between gap-4">
            {tour.dates && (
              <span className="text-xs md:text-sm font-medium text-[#6b6661] uppercase tracking-wide">
                {tour.dates}
              </span>
            )}
            {tour.price && (
              <span className="text-lg md:text-xl font-bold text-[#bea692] ml-auto">
                {tour.price.value} {tour.price.currency}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}




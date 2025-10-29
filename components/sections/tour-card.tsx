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
        "group block overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md transition-transform duration-300 hover:-translate-y-2",
        className
      )}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <SanityImage
          image={tour.mainImage}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={600}
          height={800}
          alt={tour.name}
        />
      </div>
      <div className="p-6">
        <Heading as="h3" className="text-2xl md:text-3xl">
          {tour.name}
        </Heading>
        <Paragraph className="mt-4 text-base text-gray-600">
          {tour.shortDescription}
        </Paragraph>
        {(tour.dates || tour.price) && (
          <div className="mt-6 flex items-center justify-between">
            {tour.dates && (
              <span className="text-sm font-medium text-gray-700">
                {tour.dates}
              </span>
            )}
            {tour.price && (
              <span className="text-lg font-bold text-gray-900">
                {tour.price.value} {tour.price.currency}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}




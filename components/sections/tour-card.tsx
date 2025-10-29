import { SanityImage } from "@/components/ui/sanity-image";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";

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
}

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export function TourCard({ tour, className }: TourCardProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md",
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
      <div className="space-y-3 p-6">
        <Heading as="h3" className="text-xl">
          {tour.name}
        </Heading>
        <Paragraph className="text-sm text-gray-600">
          {tour.shortDescription}
        </Paragraph>
        {(tour.dates || tour.price) && (
          <div className="flex items-center justify-between pt-2">
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
    </div>
  );
}




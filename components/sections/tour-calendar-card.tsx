import Link from "next/link";
import { SanityImage } from "@/components/ui/sanity-image";

interface TourCalendarCardProps {
  tour: {
    _id: string;
    name: string;
    slug: { current: string };
    cardImage?: any;
    mainImage?: any;
    dates?: string;
    overlayName?: string | null;
    overlayDate?: string | null;
  };
}

export function TourCalendarCard({ tour }: TourCalendarCardProps) {
  const image = tour.cardImage?.asset ? tour.cardImage : tour.mainImage;
  const title = tour.overlayName?.trim() || tour.name;
  const dates = tour.overlayDate?.trim() || tour.dates;

  return (
    <Link
      href={`/tours/${tour.slug.current}`}
      className="group block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[6/5] w-full overflow-hidden">
        <SanityImage
          image={image}
          fill
          alt={tour.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="bg-primary px-6 py-5">
        <p className="font-heading text-[26px] leading-tight text-on-primary">{title}</p>
        {dates && <p className="mt-2 text-[14px] text-on-primary/70">{dates}</p>}
      </div>
    </Link>
  );
}

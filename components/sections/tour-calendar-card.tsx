import { SmartLink } from "@/components/ui/smart-link";
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

/* Портретная пропорция фото — по просьбе заказчика карточка стала вертикальной,
   как в прежней карусели: фото занимает бóльшую долю карточки, текстовая панель
   снизу — меньшую. В макете Figma здесь было 4:3, но заказчик явно попросил выше. */
const IMAGE_ASPECT_RATIO = 3 / 4;

export function TourCalendarCard({ tour }: TourCalendarCardProps) {
  const image = tour.cardImage?.asset ? tour.cardImage : tour.mainImage;
  const caption = tour.overlayName?.trim();
  const dates = tour.overlayDate?.trim() || tour.dates;

  return (
    <SmartLink
      href={`/tours/${tour.slug.current}`}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] bg-primary transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-[26px]">
        <SanityImage
          image={image}
          fill
          aspectRatio={IMAGE_ASPECT_RATIO}
          alt={tour.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {caption && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] font-medium uppercase tracking-[1.4px] text-on-primary/80">
            {caption}
          </p>
        )}
      </div>
      {/* Панель с подписями компактнее исходной (фото занимает бóльшую долю карточки),
          но не «впритык»: высота подобрана примерно в полтора раза больше первого
          варианта — по правке заказчика. */}
      <div className="flex flex-1 flex-col px-5 pb-9 pt-7">
        {caption && (
          <p className="text-[17px] font-medium uppercase tracking-[1.3px] text-background">
            {caption}
          </p>
        )}
        <p className="mt-1 font-heading text-[30px] leading-[1.15] text-background">{tour.name}</p>
        {dates && <p className="mt-auto pt-2 text-[18px] font-medium text-background">{dates}</p>}
      </div>
    </SmartLink>
  );
}

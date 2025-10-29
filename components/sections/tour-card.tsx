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
        "group relative block overflow-hidden bg-white transition-all duration-700 hover:-translate-y-2",
        className
      )}
    >
      {/* Декоративный номер/индикатор (будет динамически меняться) */}
      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-12 h-12 rounded-full bg-[#bea692]/10 backdrop-blur-sm border border-[#bea692]/30 flex items-center justify-center">
          <span className="text-[#bea692] text-xs font-bold">→</span>
        </div>
      </div>

      {/* Изображение с асимметричным наложением */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Декоративная линия сверху */}
        <div className="absolute top-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="h-1 bg-gradient-to-r from-[#bea692] via-[#bea692]/50 to-transparent" />
        </div>
        
        {/* Градиентное наложение */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-[#1a1a1a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {/* Изображение */}
        <SanityImage
          image={tour.mainImage}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          width={600}
          height={800}
          alt={tour.name}
        />
        
        {/* Декоративный угол */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Контент с нестандартным размещением */}
      <div className="relative p-6 md:p-8 bg-white">
        {/* Вертикальная декоративная линия */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bea692] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Заголовок с декоративным элементом */}
        <div className="relative mb-4">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Heading as="h3" className="text-xl md:text-2xl mb-0 text-foreground group-hover:text-[#bea692] transition-colors duration-300 relative pl-2">
            {tour.name}
          </Heading>
        </div>
        
        {/* Описание */}
        <Paragraph className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 mb-6">
          {tour.shortDescription}
        </Paragraph>
        
        {/* Футер с информацией */}
        {(tour.dates || tour.price) && (
          <div className="mt-6 pt-6 border-t border-[#e5e0db] relative">
            {/* Декоративная точка на границе */}
            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-[#bea692] opacity-50" />
            
            <div className="flex items-center justify-between gap-4">
              {tour.dates && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#6b6661]" />
                  <span className="text-xs md:text-sm font-medium text-[#6b6661] uppercase tracking-wider">
                    {tour.dates}
                  </span>
                </div>
              )}
              {tour.price && (
                <div className="ml-auto flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-bold text-[#bea692]">
                    {tour.price.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tour.price.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Декоративный элемент внизу */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#bea692]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Внешняя тень при hover */}
      <div className="absolute inset-0 shadow-card-elevated opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
    </Link>
  );
}




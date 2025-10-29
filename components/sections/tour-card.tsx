import { SanityImage } from "@/components/ui/sanity-image";
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

function formatPrice(value: number, currency: string): string {
  // Форматируем число с пробелами для тысяч и добавляем валюту
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `OT ${formattedValue} ${currency}`;
}

export function TourCard({ tour, className }: TourCardProps) {
  const formattedPrice = tour.price
    ? formatPrice(tour.price.value, tour.price.currency)
    : null;

  return (
    <Link
      href={`/tours/${tour.slug.current}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl transition-all duration-300",
        className
      )}
    >
      {/* Контейнер карточки - весь контент поверх изображения */}
      <div className="relative aspect-[3/4] w-full">
        {/* Изображение на фоне */}
        <SanityImage
          image={tour.mainImage}
          className="absolute inset-0 h-full w-full object-cover rounded-2xl"
          fill
          alt={tour.name}
        />

        {/* Overlay - легкое затемнение по умолчанию, сильное при hover */}
        <div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-black/75 rounded-2xl z-10" />

        {/* Светлая граница/подсветка по краям */}
        <div className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none z-20" />

        {/* Весь контент поверх изображения */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-20">
          {/* Верхняя часть: название, даты, цена */}
          <div className="flex flex-col gap-2 md:gap-3">
            {/* Название тура */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-white">
              {tour.name}
            </h3>

            {/* Даты */}
            {tour.dates && (
              <p className="text-sm md:text-base uppercase tracking-wider font-medium text-white">
                {tour.dates}
              </p>
            )}

            {/* Цена */}
            {formattedPrice && (
              <p className="text-base md:text-lg lg:text-xl font-bold mt-1 text-white">
                {formattedPrice}
              </p>
            )}

            {/* Описание - появляется только при hover */}
            <div className="mt-4 overflow-hidden">
              <p className="text-sm md:text-base leading-relaxed text-white opacity-0 max-h-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:max-h-[500px]">
                {tour.shortDescription}
              </p>
            </div>
          </div>

          {/* Нижняя часть: кнопка "Подробнее" */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium uppercase tracking-wide text-white">
            <span>Подробнее</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}




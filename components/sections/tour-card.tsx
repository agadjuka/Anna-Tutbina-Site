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
  cardImage?: any;
  shortDescription: string;
  dates?: string;
  price?: Price;
  slug: { current: string };
}

interface TourCardProps {
  tour: Tour;
  className?: string;
  isActive?: boolean;
}

function formatPrice(value: number, currency: string): string {
  // Форматируем число с пробелами для тысяч и добавляем валюту
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formattedValue} ${currency}`;
}

export function TourCard({ tour, className, isActive = false }: TourCardProps) {
  const formattedPrice = tour.price
    ? formatPrice(tour.price.value, tour.price.currency)
    : null;

  return (
    <Link
      href={`/tours/${tour.slug.current}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl transition-all duration-700 ease-out",
        "hover:scale-[1.02] md:hover:-translate-y-1 hover:shadow-2xl",
        isActive && "scale-[1.02] md:-translate-y-1 shadow-2xl",
        className
      )}
    >
      {/* Контейнер карточки - весь контент поверх изображения */}
      <div className="relative aspect-[3/4] w-full">
        {/* Изображение на фоне */}
        <SanityImage
          image={tour.cardImage ?? tour.mainImage}
          className={cn(
            "absolute inset-0 h-full w-full object-cover rounded-2xl transition-transform duration-700 ease-out",
            "group-hover:scale-105",
            isActive && "scale-105"
          )}
          fill
          alt={tour.name}
        />

        {/* Overlay - легкое затемнение по умолчанию, сильное при hover или активном состоянии */}
        <div className={cn(
          "absolute inset-0 rounded-2xl z-10 transition-all duration-700 ease-out",
          "bg-black/20 group-hover:bg-black/75",
          isActive && "bg-black/75"
        )} />

        {/* Светлая граница/подсветка по краям */}
        <div className={cn(
          "absolute inset-0 rounded-2xl border pointer-events-none z-20 transition-opacity duration-700 ease-out",
          "border-white/30 group-hover:border-white/40",
          isActive && "border-white/40"
        )} />

        {/* Весь контент поверх изображения - используем em для пропорционального масштабирования */}
        <div className="absolute inset-0 flex flex-col justify-between z-20" style={{
          padding: '1.25em 1.75em'
        } as React.CSSProperties}>
          {/* Верхняя часть: название, даты, цена */}
          <div className="flex flex-col" style={{
            gap: '0.375em'
          } as React.CSSProperties}>
            {/* Название тура */}
            <h3 className="font-heading font-bold uppercase tracking-tight leading-tight text-white break-words" style={{
              fontSize: '1.875em',
              lineHeight: '1.2'
            } as React.CSSProperties}>
              {tour.name}
            </h3>

            {/* Даты */}
            {tour.dates && (
              <p className="uppercase tracking-wider font-medium text-white" style={{
                fontSize: '0.875em',
                lineHeight: '1.4'
              } as React.CSSProperties}>
                {tour.dates}
              </p>
            )}

            {/* Цена */}
            {formattedPrice && (
              <p className="font-bold text-white" style={{
                fontSize: '1.125em',
                marginTop: '0.25em',
                lineHeight: '1.4'
              } as React.CSSProperties}>
                от {formattedPrice}
              </p>
            )}

            {/* Описание - появляется только при hover или активном состоянии */}
            <div className={cn(
              "overflow-hidden",
              "group-hover:mt-0 group-hover:-mt-1",
              isActive && "mt-0 -mt-1"
            )} style={{
              marginTop: '0.75em'
            } as React.CSSProperties}>
              <p className={cn(
                "leading-snug text-white text-justify translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] break-words",
                "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[500px] group-hover:translate-y-0",
                isActive && "opacity-100 max-h-[500px] translate-y-0"
              )} style={{
                fontSize: '1em',
                lineHeight: '1.5'
              } as React.CSSProperties}>
                {tour.shortDescription}
              </p>
            </div>
          </div>

          {/* Нижняя часть: кнопка "Подробнее" */}
          <div className="flex items-center font-medium uppercase tracking-wide text-white" style={{
            gap: '0.5em',
            fontSize: '0.875em'
          } as React.CSSProperties}>
            <span className={cn(
              "text-white transition-all duration-700 ease-out",
              "group-hover:opacity-90",
              isActive && "opacity-90"
            )} style={{ color: '#ffffff' }}>Подробнее</span>
            <span className={cn(
              "text-white transition-transform duration-700 ease-out inline-block",
              "group-hover:translate-x-2",
              isActive && "translate-x-2"
            )} style={{ color: '#ffffff' }}>
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}




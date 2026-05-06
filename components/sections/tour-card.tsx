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
        "group relative block overflow-hidden rounded-2xl transition-all duration-500 ease-out transform-gpu will-change-transform",
        "md:hover:-translate-y-1 hover:shadow-2xl",
        isActive && "md:-translate-y-1 shadow-2xl",
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
            "group-hover:scale-110",
            isActive && "scale-110"
          )}
          fill
          alt={tour.name}
        />

        {/* Overlay - легкое затемнение по умолчанию, сильное при hover или активном состоянии */}
        <div className={cn(
          "absolute inset-0 rounded-2xl z-10 transition-colors duration-500 ease-out",
          "bg-black/30 group-hover:bg-black/70",
          isActive && "bg-black/70"
        )} />

        {/* Светлая граница/подсветка по краям */}
        <div className={cn(
          "absolute inset-0 rounded-2xl border pointer-events-none z-20 transition-opacity duration-500 ease-out",
          "border-white/20 group-hover:border-white/40",
          isActive && "border-white/40"
        )} />

        {/* Весь контент поверх изображения - используем em для пропорционального масштабирования */}
        <div className="absolute inset-0 flex flex-col justify-start z-20 antialiased" style={{
          padding: '1.25em 1.75em'
        } as React.CSSProperties}>
          {/* Верхняя часть: название, даты, цена */}
          <div className="flex flex-col min-h-0" style={{
            gap: '0.375em'
          } as React.CSSProperties}>
            {/* Название тура */}
            <h3 className="font-sans font-bold uppercase tracking-tight leading-tight text-white break-words" style={{
              fontSize: '1.875em',
              lineHeight: '1.2'
            } as React.CSSProperties}>
              {tour.name}
            </h3>

            {/* Даты */}
            {tour.dates && (
              <p className="uppercase tracking-wider font-medium text-white/90" style={{
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
            <div 
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-in-out",
                (isActive) ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-hover:grid-rows-[1fr]"
              )}
            >
              <div className="overflow-hidden">
                {/* Отступ вынесен внутрь, чтобы не дергался основной макет */}
                <div className="pt-3">
                  <p className={cn(
                    "leading-snug text-white/90 transition-opacity duration-500 ease-in-out break-words transform-gpu",
                    "opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100"
                  )} style={{
                    fontSize: '1em',
                    lineHeight: '1.5'
                  } as React.CSSProperties}>
                    {tour.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: кнопка "Подробнее" */}
          <div className="mt-auto flex items-center font-medium uppercase tracking-wide text-white" style={{
            gap: '0.5em',
            fontSize: '0.875em'
          } as React.CSSProperties}>
            <span className={cn(
              "text-white transition-opacity duration-500 ease-out",
              "group-hover:opacity-90",
              isActive && "opacity-90"
            )}>Подробнее</span>
            <span className={cn(
              "text-white transition-transform duration-500 ease-out inline-block",
              "group-hover:translate-x-2",
              isActive && "translate-x-2"
            )}>
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}




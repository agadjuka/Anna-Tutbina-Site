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
   снизу — меньшую. В макете Figma здесь было 4:3, но заказчик явно попросил выше.
   Позже попросил сделать чуть ниже обратно — было 3/4 (0.75), сейчас 4/5 (0.8),
   разница небольшая, карточка остаётся вертикальной. */
const IMAGE_ASPECT_RATIO = 4 / 5;

export function TourCalendarCard({ tour }: TourCalendarCardProps) {
  const image = tour.cardImage?.asset ? tour.cardImage : tour.mainImage;
  const caption = tour.overlayName?.trim();
  const dates = tour.overlayDate?.trim() || tour.dates;

  return (
    <SmartLink
      href={`/tours/${tour.slug.current}`}
      /* Карточка не участвует в общем «подъёме ссылки на 2px» анимированных
         версий (`.v6-scene a:hover` и родня в globals.css). У карточки свой,
         более выразительный hover — тень + зум фото; а подъём самой карточки
         вверх на 2px уводит её нижнюю кромку из-под курсора: наведение
         сбрасывается, карточка падает обратно, снова ловит курсор — и всё это
         мигает. Атрибут исключает её из того правила. */
      data-no-lift=""
      /* Тень задана явно в состоянии покоя (прозрачная, но с тем же числом
         слоёв, что у hover), а не через `hover:shadow-lg` от «нет тени» —
         браузер не умеет плавно анимировать box-shadow, когда меняется
         количество слоёв (0 → 2), и переход выглядит как рывок вместо
         анимации. Так оба состояния — один и тот же двухслойный shadow,
         анимируется только прозрачность. */
      className="group flex h-full flex-col overflow-hidden rounded-[26px] bg-primary shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0),0_4px_6px_-4px_rgb(0_0_0_/_0)] transition-shadow duration-300 ease-out hover:shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.12),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
    >
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[26px]">
        {/* Мобильная карусель — карточка почти во всю ширину, на десктопе три в ряд. */}
        {/* Значения зума и длительности здесь — единственный источник правды
            для этой картинки на v5/v6: там их дублирует и явно перебивает
            (за счёт специфичности) правило `[data-no-lift] .overflow-hidden`
            в globals.css — держите оба места в синхроне при следующей правке.
            Зум уменьшен (1.06→1.03) и удлинён (800→1100ms) по просьбе
            заказчика — «плавнее и меньше зум», прежнее значение читалось
            резким рывком, особенно на трёх карточках подряд в ряд. */}
        <SanityImage
          image={image}
          fill
          aspectRatio={IMAGE_ASPECT_RATIO}
          sizes="(max-width: 1023px) 85vw, 32vw"
          alt={tour.name}
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
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
      <div className="flex flex-1 flex-col px-5 pb-7 pt-6">
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

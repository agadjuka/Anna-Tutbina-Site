import { SmartLink } from "@/components/ui/smart-link";
import { SanityImage } from "@/components/ui/sanity-image";
import { tourFullTitle } from "@/lib/utils/tour-title";

interface TourCalendarCardProps {
  tour: {
    _id: string;
    name: string;
    /** Место (город/страна) — новое поле Sanity, вторая строка карточки. */
    place?: string | null;
    slug: { current: string };
    cardImage?: any;
    mainImage?: any;
    dates?: string;
    overlayName?: string | null;
    overlayDate?: string | null;
  };
  /**
   * Где стоит карточка. От этого зависит ТОЛЬКО пропорция фото, тексты
   * одинаковые.
   *
   * - `desktop` — сетка три в ряд (`year-tabs.tsx`). Фото 4:3 из макета.
   * - `mobile` — карусель (`tours-embla.tsx`). Фото 4:5, карточка вертикальная.
   *
   * Почему проп, а не адаптивные классы: пропорцию надо знать не только CSS, но
   * и серверу Sanity — он режет исходник под `aspectRatio` ещё до отдачи, и одно
   * значение на оба экрана дало бы двойной кроп (см. `sanity-image.tsx`). При
   * этом лишних загрузок не появляется: карусель и сетка — уже две независимые
   * ветки разметки (`lg:hidden` и `hidden lg:flex` в `year-tabs.tsx`), карточка
   * и раньше рендерилась дважды.
   */
  variant?: "desktop" | "mobile";
}

/* Пропорции фото.

   ДЕСКТОП — из макета (узел `5:166`): 334.66×250.98, ровно 4:3.
   МОБИЛЬНАЯ — 4:5, вертикальная карточка.

   История: изначально везде было 4:3 по макету → заказчик дважды просил выше
   (3/4, потом 4/5) → 2026-08-20 попросил вернуть к макету → 2026-08-21 уточнил:
   на десктопе оставить как в макете, а НА МОБИЛЬНОЙ вернуть прежний вертикальный
   формат («общая карточка, размер её вертикальный, верни тот, который был»).
   Значение 4/5 взято из коммита d432fb4 — состояния до августовской ревизии.
   Текстовая панель при этом не менялась: заказчик просил оставить её как есть. */
const ASPECT = {
  desktop: { ratio: 334.66 / 250.98, frame: "aspect-[334.66/250.98]", sizes: "28vw" },
  mobile: { ratio: 4 / 5, frame: "aspect-[4/5]", sizes: "85vw" },
} as const;

export function TourCalendarCard({ tour, variant = "desktop" }: TourCalendarCardProps) {
  const image = tour.cardImage?.asset ? tour.cardImage : tour.mainImage;
  const dates = tour.overlayDate?.trim() || tour.dates;
  const aspect = ASPECT[variant];

  /* Две строки, как в макете (узлы `5:163` и `5:164`): сверху НАЗВАНИЕ ТУРА
     мелким шрифтом в верхнем регистре, под ним МЕСТО крупным Cormorant.
     Место — поле Sanity `place`. Пока оно не заполнено, карточка ведёт себя
     как раньше: название тура идёт крупной строкой, мелкой строки нет —
     иначе одно и то же слово стояло бы дважды.

     Надписи поверх фото здесь НЕТ намеренно (убрана 2026-08-21 по правке
     заказчика): раньше сюда падало `overlayName` — «название тура на фото»
     со страницы тура, — а когда оно пустое, подставлялось `name`, и на
     карточке название дублировалось: мелкой строкой под фото и поверх самого
     фото. В макете (`5:155`) на фото карточки никаких подписей нет. */
  const place = tour.place?.trim();
  const tourName = tour.overlayName?.trim() || tour.name;
  const headline = place || tourName;
  const kicker = place ? tourName : null;

  return (
    /* Ссылка — только рамка попадания курсора: она не двигается и не меняет
       размер, вся анимация живёт на внутреннем `.tour-card__inner`. Так «подъём»
       карточки при наведении не уводит её кромку из-под курсора — а именно от
       этого раньше шло мигание, и поэтому карточку исключали из общего подъёма
       ссылок атрибутом `data-no-lift` (он остаётся: общий подъём двигал бы саму
       ссылку). Числа анимации — в одном месте, `app/globals.css`, блок
       «Карточка тура». */
    <SmartLink href={`/tours/${tour.slug.current}`} data-no-lift="" className="tour-card block h-full">
      <div className="tour-card__inner flex h-full flex-col overflow-hidden rounded-[26px] bg-primary">
        <div className={`tour-card__frame relative w-full shrink-0 overflow-hidden rounded-[26px] ${aspect.frame}`}>
          <SanityImage
            image={image}
            fill
            aspectRatio={aspect.ratio}
            sizes={variant === "mobile" ? "85vw" : "(max-width: 1023px) 85vw, 28vw"}
            alt={tourFullTitle(tour.name, place)}
            className="tour-card__photo object-cover"
          />
          {/* Пустые слои для наведения — блик и притенение у нижней кромки.
              Разметка нужна, потому что оба эффекта живут поверх фото и должны
              обрезаться рамкой; что именно они делают — в globals.css. */}
          <span aria-hidden="true" className="tour-card__sheen" />
          <span aria-hidden="true" className="tour-card__veil" />
        </div>
        {/* Текстовая панель ровно по узлам макета (`5:163`–`5:165`):
            отступ слева 26px, надзаголовок 20px/18.38 с трекингом 1.47px,
            название 35px/42 (Cormorant), даты 20px/22.75 полужирные.
            Вертикаль: фото заканчивается на 251.73, надзаголовок с 275,
            название с 301, даты с 349, низ карточки 400.13. */}
        {/* Кегли и поля панели МАСШТАБИРУЮТСЯ вместе с карточкой (правка
            заказчика 2026-08-21: «текст не влазит и переносится на вторую
            строку»). Раньше здесь стояли фиксированные 17/35/20px и поля 26px:
            при 1920 карточка 336px и всё помещалось, но к 1024 она ужимается до
            179px, а текст оставался прежним — надзаголовок и даты уезжали на
            две строки, причём у разных туров по-разному, и строки в соседних
            карточках переставали совпадать по высоте.

            Значения `vw` подобраны так, чтобы на 1920 давать РОВНО прежние
            цифры из макета (17 / 35 / 20px, поля 26/23/28), а ниже ужиматься
            пропорционально ширине карточки. Трекинг и интерлиньяж переведены
            в `em`, иначе они не следовали бы за кеглем. */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4 lg:min-h-[min(7.7vw,148px)] lg:px-[min(1.35vw,26px)] lg:pb-[min(1.46vw,28px)] lg:pt-[min(1.2vw,23px)]">
          {kicker && (
            /* Ровно ОДНА строка (`min-h` = один интерлиньяж). Кегль и трекинг
               подобраны так, что самое длинное из нынешних названий —
               «THE SACRED JOURNEY» — помещается в строку с запасом на всех
               ширинах от 1024px. Благодаря `min-h` строка занимает своё место
               даже у туров без надзаголовка, поэтому название и даты в соседних
               карточках стоят на одном уровне. */
            <p className="text-[12px] font-medium uppercase tracking-[0.108em] text-background lg:min-h-[1.08em] lg:text-[clamp(12px,0.885vw,17px)] lg:leading-[1.08] lg:tracking-[0.07em]">
              {kicker}
            </p>
          )}
          <p className="mt-1 font-heading text-[27px] leading-[1.15] text-background lg:mt-[min(0.42vw,8px)] lg:text-[min(1.82vw,35px)] lg:leading-[1.2]">
            {headline}
          </p>
          {dates && (
            <p className="mt-auto pt-2 text-[16px] font-medium text-background lg:pt-[min(0.31vw,6px)] lg:text-[clamp(12px,1.04vw,20px)] lg:leading-[1.14]">
              {dates}
            </p>
          )}
        </div>
      </div>
    </SmartLink>
  );
}

import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: any;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  fill?: boolean;
  /** Соотношение сторон (width/height) реального контейнера в режиме fill.
   * Без него Sanity всегда кропает по фиксированному портретному 1200×1600 —
   * несовпадение с формой контейнера даёт двойной, непредсказуемый кроп
   * (Sanity режет по hotspot под 3:4, потом браузер поверх режет под реальную рамку). */
  aspectRatio?: number;
  /** Ширина картинки на экране для `fill` — атрибут `sizes` у next/image.
   *
   * Без него next/image считает, что картинка занимает всю ширину окна (`100vw`),
   * и браузер тянет самый крупный вариант из srcset — на ретине это 3840px
   * вместо реальных 300–700. Каждый такой кадр надо скачать и РАСКОДИРОВАТЬ в
   * главном потоке: именно на этом прокрутка «залипала» в момент, когда секция
   * входит в кадр. Поэтому там, где раскладка известна, размер надо передавать. */
  sizes?: string;
  /** Первый экран: грузить сразу, а не лениво (LCP-кадры HERO). */
  priority?: boolean;
  /**
   * ТОЧНЫЙ КАДР ИЗ МАКЕТА — доли бокса-обёртки в процентах, как их задаёт Figma
   * (`width` / `height` / `left` / `top` у слоя-картинки).
   *
   * Зачем: `object-fit: cover` всегда центрирует кадр, а в макете фоновые фото
   * сдвинуты — например, в VALUES левое поднято на 38.5% вверх, и именно
   * поэтому в Figma видно лица девушек, а у нас была середина кадра с песком.
   * Подогнать это `object-position` нельзя: сервер Sanity ещё и режет исходник
   * под `aspectRatio` (см. выше), получается двойной кроп.
   *
   * Когда проп передан: серверного кропа нет (запрашивается вся картинка),
   * а браузер ставит её ровно теми же процентами, что и Figma.
   * Обёртке нужен `overflow-hidden` — картинка намеренно больше неё.
   */
  figmaCrop?: { width: number; height: number; left: number; top: number };
}

export function SanityImage({
  image,
  className,
  width = 800,
  height = 800,
  alt = "",
  fill = false,
  aspectRatio,
  sizes,
  priority = false,
  figmaCrop,
}: SanityImageProps) {
  if (!image?.asset) {
    return (
      <div
        className={className}
        style={{
          width: fill ? "100%" : `${width}px`,
          height: fill ? "100%" : `${height}px`,
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-gray-400">Нет изображения</span>
      </div>
    );
  }

  try {
    const fillWidth = 1200;
    const fillHeight = aspectRatio ? Math.round(fillWidth / aspectRatio) : 1600;
    const imageUrl = fill
      ? figmaCrop
        /* Без `.height()` — сервер отдаёт кадр целиком, кроп задаёт макет. */
        ? urlFor(image).width(fillWidth).auto("format").quality(90).url()
        : urlFor(image).width(fillWidth).height(fillHeight).auto("format").quality(90).url()
      : urlFor(image).width(width * 2).height(height * 2).auto("format").quality(90).url();

    /* Кадр из макета. Режим `fill` тут использовать НЕЛЬЗЯ: next/image падает
       с «has both fill and style.width» — при `fill` он жёстко держит 100%.
       Поэтому обычная картинка, позиционируемая процентами внутри обёртки
       (обёртке нужен `relative` + `overflow-hidden`). `width`/`height` здесь —
       только подсказка пропорции для next/image, реальный размер задаёт CSS. */
    if (fill && figmaCrop) {
      return (
        <Image
          src={imageUrl}
          alt={alt}
          width={1200}
          height={1600}
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={cn("absolute max-w-none", className)}
          style={{
            objectFit: "cover",
            width: `${figmaCrop.width}%`,
            height: `${figmaCrop.height}%`,
            left: `${figmaCrop.left}%`,
            top: `${figmaCrop.top}%`,
          }}
        />
      );
    }

    if (fill) {
      return (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          /* `100vw` — прежнее поведение по умолчанию (next/image подставлял его
             молча). Здесь оно хотя бы явное, а вызывающий код может сузить. */
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={className}
          style={{ objectFit: "cover" }}
        />
      );
    }

    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  } catch (error) {
    return (
      <div
        className={className}
        style={{
          width: fill ? "100%" : `${width}px`,
          height: fill ? "100%" : `${height}px`,
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-gray-400">Ошибка загрузки</span>
      </div>
    );
  }
}


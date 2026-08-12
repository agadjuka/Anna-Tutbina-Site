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
}

export function SanityImage({
  image,
  className,
  width = 800,
  height = 800,
  alt = "",
  fill = false,
  aspectRatio,
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
      ? urlFor(image).width(fillWidth).height(fillHeight).auto("format").quality(90).url()
      : urlFor(image).width(width * 2).height(height * 2).auto("format").quality(90).url();

    if (fill) {
      return (
        <Image
          src={imageUrl}
          alt={alt}
          fill
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


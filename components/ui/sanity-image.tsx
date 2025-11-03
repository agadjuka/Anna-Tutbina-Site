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
}

export function SanityImage({
  image,
  className,
  width = 800,
  height = 800,
  alt = "",
  fill = false,
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
    const imageUrl = fill
      ? urlFor(image).width(1200).height(1600).auto("format").quality(90).url()
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


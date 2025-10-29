import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: any;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export function SanityImage({
  image,
  className,
  width = 800,
  height = 800,
  alt = "",
}: SanityImageProps) {
  if (!image?.asset) {
    return (
      <div
        className={className}
        style={{
          width: `${width}px`,
          height: `${height}px`,
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
    const imageUrl = urlFor(image).width(width).height(height).url();

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
          width: `${width}px`,
          height: `${height}px`,
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


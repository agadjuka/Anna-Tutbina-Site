"use client";

import { useEffect, useRef, useState } from "react";
import { TourCard } from "./tour-card";
import { cn } from "@/lib/utils";

interface TourCardWrapperProps {
  tour: {
    name: string;
    mainImage: any;
    cardImage?: any;
    shortDescription: string;
    dates?: string;
    price?: { value: number; currency: string };
    slug: { current: string };
  };
  className?: string;
  isActive?: boolean;
}

export function TourCardWrapper({ tour, className, isActive = false }: TourCardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const updateFontSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // Базовый размер шрифта пропорционален ширине карточки
      // Для карточки шириной 400px -> 16px, для 300px -> 12px и т.д.
      const baseSize = (width / 400) * 16;
      // Ограничиваем диапазон от 10px до 20px для предотвращения экстремальных значений
      const clampedSize = Math.max(10, Math.min(20, baseSize));
      setFontSize(clampedSize);
    };

    updateFontSize();
    
    const resizeObserver = new ResizeObserver(updateFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ fontSize: `${fontSize}px` } as React.CSSProperties}
    >
      <TourCard tour={tour} isActive={isActive} className={className} />
    </div>
  );
}


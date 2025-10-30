"use client";

import { useEffect, useRef, useState } from "react";
import { TourCard } from "./tour-card";
import { cn } from "@/lib/utils";

interface Price {
  value: number;
  currency: string;
}

interface Tour {
  _id: string;
  name: string;
  slug: { current: string };
  mainImage: any;
  shortDescription: string;
  dates?: string;
  price?: Price;
}

interface ToursCarouselProps {
  tours: Tour[];
}

export function ToursCarousel({ tours }: ToursCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

  // Находит индекс карточки, чей центр ближе всего к центру контейнера
  const getClosestIndex = (): { index: number; distancePx: number; widthPx: number } => {
    const container = containerRef.current;
    if (!container) return { index: 0, distancePx: 0, widthPx: 1 };

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;
    let closestWidth = 1;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
        closestWidth = rect.width;
      }
    });

    return { index: closestIndex, distancePx: closestDistance, widthPx: closestWidth };
  };

  // Функция для центрирования карточки по индексу
  const scrollToCard = (index: number) => {
    const card = cardsRef.current[index];
    const container = containerRef.current;
    
    if (card && container && !isScrollingRef.current) {
      isScrollingRef.current = true;
      const containerWidth = container.offsetWidth;
      const cardWidth = card.offsetWidth;
      // Центр элемента относительно контейнера, учитывая текущий scrollLeft
      const cardCenterX = card.offsetLeft + cardWidth / 2;
      const targetScroll = Math.round(cardCenterX - containerWidth / 2);
      
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
      
      // Сбрасываем флаг после завершения прокрутки
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    }
  };

  // Центрируем первую карточку при монтировании
  useEffect(() => {
    const container = containerRef.current;
    if (!container || cardsRef.current.length === 0) return;

    // Небольшая задержка для завершения рендеринга
    const timeout = setTimeout(() => {
      if (cardsRef.current[0] && !isScrollingRef.current) {
        scrollToCard(0);
        setActiveIndex(0);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [tours.length]);

  // Слежение за прокруткой: определяем ближайшую к центру карточку
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let scrollTimeout: NodeJS.Timeout;

    const updateActiveByCenter = () => {
      const { index: closestIndex } = getClosestIndex();

      // Всегда синхронизируем активную карточку с ближайшей к центру
      if (closestIndex !== activeIndex && !isScrollingRef.current) {
        setActiveIndex(closestIndex);
      }

      // После окончания прокрутки принудительно центрируем ближайшую
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isScrollingRef.current) {
          scrollToCard(closestIndex);
          setActiveIndex(closestIndex);
        }
      }, 120);
    };

    const onScroll = () => {
      if (isScrollingRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveByCenter);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    // Инициализируем активную карточку
    updateActiveByCenter();

    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex]);

  // Удалён лишний debounce-блок: центрирование происходит в useEffect выше

  // Обработка событий touch для лучшего контроля на мобильных
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartScrollLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      dragging = true;
      touchStartX = e.touches[0].clientX;
      touchStartScrollLeft = container.scrollLeft;
      lastX = touchStartX;
      lastT = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault(); // отключаем нативную инерцию для полного контроля
      const x = e.touches[0].clientX;
      const now = performance.now();
      const dx = touchStartX - x; // положительно при свайпе влево
      container.scrollLeft = touchStartScrollLeft + dx;
      velocity = (lastX - x) / Math.max(1, now - lastT); // px/ms
      lastX = x;
      lastT = now;
    };

    const handleTouchEnd = () => {
      if (!dragging) return;
      dragging = false;
      // Если уже близко к центру (<=25% ширины) — дотягиваем ровно в центр
      const { index: closestIndex, distancePx, widthPx } = getClosestIndex();
      const proximityThreshold = widthPx * 0.25;
      if (distancePx <= proximityThreshold) {
        scrollToCard(closestIndex);
        return;
      }
      // Иначе используем скорость для выбора направления
      const speedPxMs = velocity; // px/ms
      const speedThreshold = 0.5; // эмпирически
      if (speedPxMs > speedThreshold && activeIndex > 0) {
        scrollToCard(activeIndex - 1);
        return;
      }
      if (speedPxMs < -speedThreshold && activeIndex < tours.length - 1) {
        scrollToCard(activeIndex + 1);
        return;
      }
      // Фолбэк: ближайшая к центру
      scrollToCard(closestIndex);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove as any);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, tours.length]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex gap-6 overflow-x-auto overflow-y-visible",
        "scrollbar-hide", // Скрываем скроллбар
        "snap-x snap-mandatory", // Включаем snap прокрутку
        "-mx-4 px-4", // Компенсация padding для скролла до края
        "pt-6", // Отступ сверху перед карточками
        "md:hidden" // Только на мобильных
      )}
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE и Edge
        WebkitOverflowScrolling: "touch", // Плавная прокрутка на iOS
      }}
    >
      {tours.map((tour, index) => (
        <div
          key={tour._id}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
          className={cn(
            "flex-shrink-0 snap-center snap-always", // Каждая карточка центрируется при прокрутке и всегда останавливается на снап-точке
            "w-[80vw]", // Ширина карточки 80% экрана
            "max-w-[400px]" // Максимальная ширина
          )}
        >
          <TourCard 
            tour={tour} 
            isActive={index === activeIndex}
            className="[&>div]:!aspect-[4/5]"
          />
        </div>
      ))}
    </div>
  );
}


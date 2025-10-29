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

  // Функция для центрирования карточки по индексу
  const scrollToCard = (index: number) => {
    const card = cardsRef.current[index];
    const container = containerRef.current;
    
    if (card && container && !isScrollingRef.current) {
      isScrollingRef.current = true;
      const cardOffsetLeft = card.offsetLeft;
      const containerWidth = container.offsetWidth;
      const cardWidth = card.offsetWidth;
      
      // Рассчитываем позицию для центрирования
      const targetScroll = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
      
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
      
      // Сбрасываем флаг после завершения прокрутки
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
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
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [tours.length]);

  // Используем Intersection Observer для определения активной карточки
  useEffect(() => {
    const container = containerRef.current;
    if (!container || cardsRef.current.length === 0) return;

    const observerOptions = {
      root: container,
      rootMargin: "0px",
      threshold: [0.5, 0.6, 0.7], // Карточка активна, если больше половины видна в центре
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Находим карточку с наибольшим intersectionRatio
      let maxRatio = 0;
      let activeCardIndex = activeIndex;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const index = cardsRef.current.findIndex((card) => card === entry.target);
          if (index !== -1) {
            activeCardIndex = index;
          }
        }
      });

      // Обновляем активную карточку только если не происходит программная прокрутка
      if (maxRatio >= 0.6 && activeCardIndex !== activeIndex && !isScrollingRef.current) {
        setActiveIndex(activeCardIndex);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Наблюдаем за всеми карточками
    const observeCards = () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.observe(card);
        }
      });
    };

    // Небольшая задержка для гарантии, что все карточки отрендерены
    const timeout = setTimeout(observeCards, 50);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [tours.length, activeIndex]);

  // Обработка завершения прокрутки для центрирования ближайшей карточки
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrollingRef.current) return; // Игнорируем программную прокрутку
      
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        // Находим карточку, наиболее близкую к центру контейнера
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestIndex = 0;
        let closestDistance = Infinity;

        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        // Центрируем ближайшую карточку, если она не уже активна
        if (closestIndex !== activeIndex && !isScrollingRef.current) {
          scrollToCard(closestIndex);
        }
      }, 200); // Задержка для определения остановки прокрутки
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex]);

  // Обработка событий touch для лучшего контроля на мобильных
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartScrollLeft = container.scrollLeft;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      const threshold = 50; // Минимальное расстояние для переключения

      if (Math.abs(diff) > threshold) {
        // Определяем направление и находим следующую/предыдущую карточку
        const currentCard = cardsRef.current[activeIndex];
        if (!currentCard) return;

        const cardWidth = currentCard.offsetWidth;
        const gap = 24; // gap-6 в Tailwind = 1.5rem = 24px
        const scrollDistance = cardWidth + gap;

        if (diff > 0 && activeIndex < tours.length - 1) {
          // Свайп влево - следующая карточка
          scrollToCard(activeIndex + 1);
        } else if (diff < 0 && activeIndex > 0) {
          // Свайп вправо - предыдущая карточка
          scrollToCard(activeIndex - 1);
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
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
            "flex-shrink-0 snap-center", // Каждая карточка центрируется при прокрутке
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


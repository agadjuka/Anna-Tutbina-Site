"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ToursEmbla } from "./tours-embla";
import { TourCalendarCard } from "./tour-calendar-card";

interface Tour {
  _id: string;
  name: string;
  /** Место (город/страна) — вторая строка карточки, см. `tour-calendar-card.tsx`. */
  place?: string | null;
  slug: { current: string };
  cardImage?: any;
  mainImage?: any;
  dates?: string;
  year?: number | null;
  overlayName?: string | null;
  overlayDate?: string | null;
}

interface YearTabsProps {
  tours: Tour[];
  headingSlot?: React.ReactNode;
}

export function YearTabs({ tours, headingSlot }: YearTabsProps) {
  const years = useMemo(
    () => [...new Set(tours.map((t) => t.year).filter((y): y is number => typeof y === "number"))].sort(),
    [tours]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(years[0] ?? null);

  // Пока у туров не проставлен год (см. отчёт по блоку) — показываем все туры без фильтра,
  // чтобы секция не была пустой. Как только году появятся, вкладки заработают сами.
  const visibleTours = years.length === 0 ? tours : tours.filter((t) => t.year === selectedYear);

  return (
    <div>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {headingSlot}

        {years.length > 0 && (
          <div className="flex shrink-0 gap-[30px]">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "inline-flex h-[52px] items-center justify-center rounded-full border px-8 text-[20px] tracking-[0.03em] transition-colors duration-300 lg:w-[125px] lg:px-0",
                  selectedYear === year
                    ? "border-primary bg-primary text-on-primary"
                    : "border-subtle-border text-subtle hover:bg-primary/5"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*
        <lg — карусель (см. ToursEmbla), упор на мобильную версию, как просил
        заказчик. lg+ — карточки одного размера в ряду (равная высота через
        `items-stretch`), а если туров больше трёх — они переносятся на новую
        строку и центрируются, а не улетают в горизонтальный скролл: `flex-wrap`
        + `justify-center` центрирует остаток и неполной последней строки сам,
        в отличие от CSS Grid, где неполная строка осталась бы прижатой к левому краю.
      */}
      <div className="mt-10 lg:mt-0">
        <div className="lg:hidden">
          <ToursEmbla tours={visibleTours} />
        </div>
        {/* Из макета (`5:155`): карточка 335.66×400.13, шаг колонок 457.5 →
            зазор 121.5px, сетка целиком 1250.66px. Было 40px — карточки
            разъезжались до 380px и смотрелись крупнее макета. */}
        <div className="mt-[min(3.85vw,74px)] hidden lg:flex lg:flex-wrap lg:items-stretch lg:justify-center lg:gap-x-[min(6.33vw,121.5px)] lg:gap-y-16">
          {/*
            Ширина карточки — доля контейнера, а не фикс. px: `(100% - 2 зазора) / 3`
            гарантирует ровно 3 в ряд на любой ширине контейнера. С фиксированными
            px-ширинами третья карточка не помещалась и переносилась вниз, хотя место
            под неё было. Четвёртая и далее переносятся на новую строку и центрируются
            (`justify-center`) — в отличие от CSS Grid, где неполная строка прижалась
            бы к левому краю.
          */}
          {visibleTours.map((tour) => (
            <div key={tour._id} className="lg:w-[calc((100%-min(12.66vw,243px))/3)]">
              <TourCalendarCard tour={tour} variant="desktop" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

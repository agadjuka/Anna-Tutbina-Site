"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { TourCalendarCard } from "./tour-calendar-card";

interface Tour {
  _id: string;
  name: string;
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
          <div className="flex shrink-0 gap-3">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-colors duration-300",
                  selectedYear === year
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border text-primary hover:bg-primary/5"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-[120px]">
        {visibleTours.map((tour) => (
          <TourCalendarCard key={tour._id} tour={tour} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  available: boolean;
}

interface TourNavigationProps {
  sections: NavigationItem[];
}

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 140; // Отступ сверху для фиксированной шапки и видимости заголовка
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

export function TourNavigation({ sections }: TourNavigationProps) {
  const availableSections = sections.filter((section) => section.available);

  if (availableSections.length === 0) {
    return null;
  }

  const firstRowCount = Math.ceil(availableSections.length / 2);
  const firstRow = availableSections.slice(0, firstRowCount);
  const secondRow = availableSections.slice(firstRowCount);

  return (
    <div className="md:flex md:flex-nowrap items-center md:justify-between gap-2 md:gap-3 pb-1 mt-2">
      <div className="md:hidden space-y-2 w-full">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {firstRow.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group relative inline-flex items-center justify-center",
                "px-2 py-1.5",
                "w-auto",
                "text-[11px]",
                "font-normal tracking-normal",
                "text-muted-foreground",
                "hover:text-[#bea692]",
                "transition-colors duration-300 ease-out",
                "whitespace-nowrap",
                "border-b border-[#e5e0db]/40",
                "hover:border-[#bea692]/50",
                "focus:outline-none"
              )}
              aria-label={`Перейти к разделу ${section.label}`}
            >
              {section.label}
            </button>
          ))}
        </div>
        {secondRow.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {secondRow.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group relative inline-flex items-center justify-center",
                  "px-2 py-1.5",
                  "w-auto",
                  "text-[11px]",
                  "font-normal tracking-normal",
                  "text-muted-foreground",
                  "hover:text-[#bea692]",
                  "transition-colors duration-300 ease-out",
                  "whitespace-nowrap",
                  "border-b border-[#e5e0db]/40",
                  "hover:border-[#bea692]/50",
                  "focus:outline-none"
                )}
                aria-label={`Перейти к разделу ${section.label}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex md:flex-nowrap items-center md:justify-between gap-3 flex-1">
        {availableSections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "group relative inline-flex items-center justify-center",
              "px-3 py-1.5",
              "flex-1 min-w-0",
              "text-xs",
              "font-normal tracking-normal",
              "text-muted-foreground",
              "hover:text-[#bea692]",
              "transition-colors duration-300 ease-out",
              "whitespace-nowrap",
              "border-b border-[#e5e0db]/40",
              "hover:border-[#bea692]/50",
              "focus:outline-none"
            )}
            aria-label={`Перейти к разделу ${section.label}`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}


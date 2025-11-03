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

  return (
    <div className="flex items-center justify-between gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 mt-2">
      {availableSections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={cn(
            "group relative inline-flex items-center justify-center",
            "px-2 md:px-3 py-1.5 flex-1 min-w-0",
            "text-[11px] md:text-xs",
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
  );
}


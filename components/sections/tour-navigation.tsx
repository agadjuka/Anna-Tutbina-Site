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
    const offset = 80; // Отступ сверху для фиксированной шапки
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
    <div className="w-full flex justify-center mt-4 md:mt-6 mb-2">
      <div className="max-w-4xl w-full">
        <div className="flex flex-nowrap items-center justify-center gap-3 md:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-1">
          {availableSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group relative inline-flex items-center",
                "px-0 py-1",
                "text-[10px] md:text-xs",
                "font-normal tracking-normal",
                "text-muted-foreground",
                "hover:text-[#bea692]",
                "transition-colors duration-200 ease-in-out",
                "whitespace-nowrap",
                "border-b border-transparent",
                "hover:border-[#bea692]/30",
                "focus:outline-none"
              )}
              aria-label={`Перейти к разделу ${section.label}`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


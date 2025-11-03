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
    <div className="w-full flex justify-center mt-6 md:mt-8 mb-4">
      <div className="max-w-4xl w-full">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5 lg:gap-3">
          {availableSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group relative inline-flex items-center justify-center",
                "px-3 md:px-4 lg:px-5 py-2 md:py-2.5",
                "text-xs md:text-sm",
                "font-medium tracking-wide",
                "rounded-full",
                "bg-white/95 backdrop-blur-sm",
                "border border-[#e5e0db]",
                "text-foreground",
                "hover:bg-[#bea692] hover:text-white hover:border-[#bea692]",
                "transition-all duration-300 ease-in-out",
                "shadow-sm hover:shadow-md hover:shadow-[#bea692]/20",
                "focus:outline-none focus:ring-2 focus:ring-[#bea692]/50 focus:ring-offset-2",
                "whitespace-nowrap",
                "transform hover:-translate-y-0.5 hover:scale-105"
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


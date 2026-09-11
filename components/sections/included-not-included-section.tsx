"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import { cn } from "@/lib/utils";
import { TOUR_BLOCK_WIDTH } from "@/lib/tour-layout";

interface IncludedNotIncludedSectionProps {
  included?: any;
  notIncluded?: any;
}

export function IncludedNotIncludedSection({ 
  included, 
  notIncluded 
}: IncludedNotIncludedSectionProps) {
  // Компоненты для рендеринга PortableText с кастомными списками
  const listComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => (
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-3 lg:text-[calc(12.9*var(--ona-u))] lg:leading-[calc(20.6*var(--ona-u))] lg:mb-[calc(9.6*var(--ona-u))]">
          {props.children}
        </p>
      ),
    },
    marks: {
      strong: (props) => (
        <strong className="font-semibold">{props.children}</strong>
      ),
    },
    list: {
      bullet: (props) => (
        <ul className="list-none space-y-3 md:space-y-4 pl-0 mt-0 lg:space-y-[calc(12.8*var(--ona-u))]">
          {props.children}
        </ul>
      ),
    },
    listItem: {
      bullet: (props) => (
        <li className="flex items-start gap-3 md:gap-4 text-base md:text-lg leading-relaxed text-muted-foreground lg:gap-[calc(12.8*var(--ona-u))] lg:text-[calc(12.9*var(--ona-u))] lg:leading-[calc(20.6*var(--ona-u))]">
          <span className="text-primary font-medium shrink-0 mt-0.5">—</span>
          <span className="flex-1">{props.children}</span>
        </li>
      ),
    },
  };

  const hasContent = included || notIncluded;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div className={cn("w-full", TOUR_BLOCK_WIDTH)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-[calc(64*var(--ona-u))]">
          {/* Что включено */}
          {included && (
            <div className="space-y-4 md:space-y-5 lg:space-y-[calc(16*var(--ona-u))]">
              <h3 className="text-base md:text-lg uppercase tracking-[0.15em] font-medium text-primary mb-4 md:mb-6 lg:text-[calc(11*var(--ona-u))] lg:mb-[calc(19.2*var(--ona-u))]">
                Что включено
              </h3>
              <div>
                <PortableText 
                  value={included} 
                  components={listComponents}
                />
              </div>
            </div>
          )}

          {/* Что не включено */}
          {notIncluded && (
            <div className="space-y-4 md:space-y-5 lg:space-y-[calc(16*var(--ona-u))]">
              <h3 className="text-base md:text-lg uppercase tracking-[0.15em] font-medium text-primary mb-4 md:mb-6 lg:text-[calc(11*var(--ona-u))] lg:mb-[calc(19.2*var(--ona-u))]">
                Не входит в стоимость
              </h3>
              <div>
                <PortableText 
                  value={notIncluded} 
                  components={listComponents}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


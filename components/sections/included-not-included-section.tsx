"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";

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
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-3">
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
        <ul className="list-none space-y-3 md:space-y-4 pl-0 mt-0">
          {props.children}
        </ul>
      ),
    },
    listItem: {
      bullet: (props) => (
        <li className="flex items-start gap-3 md:gap-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          <span className="text-[#bea692] font-medium shrink-0 mt-0.5">—</span>
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
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
          {/* Что включено */}
          {included && (
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-base md:text-lg uppercase tracking-[0.15em] font-medium text-[#bea692] mb-4 md:mb-6">
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
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-base md:text-lg uppercase tracking-[0.15em] font-medium text-[#bea692] mb-4 md:mb-6">
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


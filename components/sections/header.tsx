"use client";

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useEffect, useRef } from "react";

/** Цвета из правок: хедер #69695C, логотип и текст навигации #EEEAE4 */
const HEADER_BG = "#69695C";
const HEADER_FG = "#EEEAE4";

/** Временная настройка для скрытия навигации: туры, обо мне, отзывы */
const HIDE_NAVIGATION = true;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 left-0 w-full z-50 border-b border-[#69695C]/90 backdrop-blur-md shadow-md"
      style={{ backgroundColor: HEADER_BG }}
    >
      <Container>
        <div className="relative flex items-center justify-between py-2 md:py-4">
          {/* Левая полоска удалена по запросу пользователя */}

          <Link
            href="/"
            className="flex flex-col items-start justify-center -my-2 md:-my-4 py-2 md:py-4 px-3 md:px-4 hover:opacity-90 transition-opacity"
            style={{ color: HEADER_FG }}
            aria-label="ONÁ — на главную"
          >
            <span className="font-logo text-4xl md:text-5xl tracking-tight leading-none">
              ONÁ
            </span>
            <span className="font-logo-subtitle text-[18px] md:text-[26px] tracking-wide -mt-2 md:-mt-3 opacity-95">
              woman space & travel
            </span>
          </Link>

          {!HIDE_NAVIGATION && (
            <nav>
              <ul className="flex items-center gap-8 md:gap-12 text-base md:text-xl">
                <li>
                  <Link
                    href="/#tours"
                    className="transition-opacity duration-300 relative pb-1 group hover:opacity-90"
                    style={{ color: HEADER_FG }}
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Туры</span>
                    <div
                      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                    <div
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="transition-opacity duration-300 relative pb-1 group hover:opacity-90"
                    style={{ color: HEADER_FG }}
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Обо мне</span>
                    <div
                      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                    <div
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#reviews"
                    className="transition-opacity duration-300 relative pb-1 group hover:opacity-90"
                    style={{ color: HEADER_FG }}
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Отзывы</span>
                    <div
                      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                    <div
                      className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: HEADER_FG }}
                    />
                  </Link>
                </li>
              </ul>
            </nav>
          )}


        </div>
      </Container>
    </header>
  );
}

"use client";

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Временная настройка для скрытия навигации: туры, обо мне, отзывы */
const HIDE_NAVIGATION = true;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Показываем навигацию, если мы в режиме админа (путь начинается с /admin/)
  const showNavigation = !HIDE_NAVIGATION || pathname?.startsWith('/admin/') || pathname === '/admin';

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
      className="sticky top-0 left-0 z-50 w-full border-b border-primary/90 bg-primary text-background shadow-md backdrop-blur-md"
    >
      <Container>
        <div className="relative flex items-center justify-between py-2 md:py-4">
          <Link
            href="/"
            className="flex flex-col items-start justify-center -my-2 px-3 py-2 text-background transition-opacity hover:opacity-90 md:-my-4 md:px-4 md:py-4"
            aria-label="ONÁ — на главную"
          >
            <span className="font-logo text-4xl leading-none tracking-tight md:text-5xl">
              ONÁ
            </span>
            <span className="font-logo-subtitle -mt-2 text-[18px] tracking-wide opacity-95 md:-mt-3 md:text-[26px]">
              woman space & travel
            </span>
          </Link>
          
          {showNavigation && (
            <nav>
              <ul className="flex items-center gap-8 text-base md:gap-12 md:text-xl">
                <li>
                  <Link
                    href="/#tours"
                    className="group relative pb-1 text-background transition-opacity duration-300 hover:opacity-90"
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Туры</span>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-background transition-all duration-300 group-hover:w-full" />
                    <div className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-background opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="group relative pb-1 text-background transition-opacity duration-300 hover:opacity-90"
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Обо мне</span>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-background transition-all duration-300 group-hover:w-full" />
                    <div className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-background opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#reviews"
                    className="group relative pb-1 text-background transition-opacity duration-300 hover:opacity-90"
                  >
                    <span className="relative z-10 whitespace-nowrap text-inherit !text-base md:!text-xl">Отзывы</span>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-background transition-all duration-300 group-hover:w-full" />
                    <div className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-background opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { SmartLink } from "@/components/ui/smart-link";
import { cn } from "@/lib/utils";

/**
 * Временная настройка для скрытия навигации.
 *
 * 2026-08-20 выключена по правкам заказчика («в шапке необходимо отобразить
 * разделы так, как предусмотрено в референсе в Figma»): меню должно быть видно
 * и на главной, и на страницах туров. Сам режим ограничений доступа
 * (`middleware.ts`) при этом не тронут — сайт по-прежнему закрыт, вход через
 * `/admin`. Следствие, о котором договорились явно: посетитель публичной
 * `/tours/kas` видит пункты меню, ведущие на закрытую главную, и по клику
 * возвращается на `/tours/kas` редиректом.
 *
 * Разбор правки — `docs/redesign/client-feedback-2026-08.md`, п. 3.1.
 */
const HIDE_NAVIGATION = false;

/**
 * Пункты меню по макету (Figma, нода 5:307). Верхний регистр задаётся стилями,
 * поэтому подписи храним так, как их пишет заказчик.
 *
 * `#values` появится вместе с блоком «Почему нас выбирают» — до этого якорь пустой.
 */
const NAV_ITEMS = [
  { label: "о проекте", href: "/#about" },
  { label: "календарь", href: "/#tours" },
  { label: "отзывы", href: "/#reviews" },
  { label: "наши ценности", href: "/#values" },
  { label: "FAQ", href: "/#faq" },
  { label: "контакты", href: "/#contacts" },
] as const;

/** Общая типографика пунктов меню: 12px, uppercase, трекинг 1.56px из макета. */
const NAV_LINK_TYPO =
  "text-xs font-medium uppercase leading-[21px] tracking-[0.13em] text-background";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Показываем навигацию, если мы в режиме админа (путь начинается с /admin/)
  const showNavigation =
    !HIDE_NAVIGATION || pathname?.startsWith("/admin/") || pathname === "/admin";

  useEffect(() => {
    /* Порог — не 0, а треть экрана: иначе шапка мигала бы от каждого микро-скролла
       у самого верха. Появляется примерно когда HERO начал уходить из кадра.

       `last` — чтобы не дёргать setState на каждом событии скролла: обработчик
       срабатывает десятки раз в секунду, а меняется значение дважды за страницу. */
    let last = false;
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.3;
      if (next === last) return;
      last = next;
      setScrolled(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* `data-shown` — просто факт «страница прокручена или открыто меню».
     2026-08-20 на него больше никто не смотрит: правила скрытия шапки над
     полноэкранным HERO удалены из globals.css по правкам заказчика (шапка
     должна быть видна с первого экрана). Атрибут оставлен как готовая зацепка,
     если поведение попросят вернуть точечно. */
  const shown = scrolled || menuOpen;

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

  // Мобильное меню закрывается по Escape
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      data-site-header=""
      data-shown={shown ? "true" : "false"}
      className={cn(
        "sticky top-0 left-0 z-50 w-full bg-primary/[0.86] text-background backdrop-blur-md",
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none"
      )}
    >
      {/* Шапка шире контентного контейнера: в макете логотип и меню прижаты к краям (~128px при 1920) */}
      <div className="relative flex h-16 w-full items-center justify-between px-4 md:h-[72px] md:px-8 lg:h-[86px] lg:px-16 xl:px-32">
        <SmartLink
          href="/"
          onClick={closeMenu}
          className="flex flex-col items-start justify-center text-background transition-opacity hover:opacity-90"
          aria-label="ONÁ — на главную"
        >
          <span className="font-logo text-[30px] leading-none tracking-tight md:text-[34px] lg:text-[38px]">
            ONÁ
          </span>
          <span className="font-logo-subtitle -mt-1.5 text-[13px] tracking-wide opacity-95 md:-mt-2 md:text-[15px] lg:text-[17px]">
            woman space &amp; travel
          </span>
        </SmartLink>

        {showNavigation && (
          <>
            <nav className="hidden lg:block" aria-label="Основная навигация">
              <ul className="flex items-center gap-8 xl:gap-9">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <SmartLink
                      href={item.href}
                      className={cn(
                        "group relative block py-1 transition-opacity duration-300 hover:opacity-80",
                        NAV_LINK_TYPO
                      )}
                    >
                      <span className="whitespace-nowrap text-inherit">{item.label}</span>
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-background transition-all duration-300 group-hover:w-full" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="-mr-2 flex h-10 w-10 items-center justify-center text-background lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
        )}
      </div>

      {/* Панель мобильного меню — absolute, чтобы не менять высоту шапки и не ломать --header-height */}
      {showNavigation && (
        <nav
          id="mobile-nav"
          aria-label="Мобильная навигация"
          className={cn(
            "absolute left-0 top-full w-full overflow-hidden bg-primary/[0.96] backdrop-blur-md transition-all duration-300 lg:hidden",
            menuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          <ul className="flex flex-col px-4 pb-5 pt-1 md:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  onClick={closeMenu}
                  className={cn("block py-2.5", NAV_LINK_TYPO)}
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

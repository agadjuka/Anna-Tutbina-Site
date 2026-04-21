import { Container } from "@/components/ui/container";
import Link from "next/link";

/** Цвета из правок: хедер #69695C, логотип и текст навигации #EEEAE4 */
const HEADER_BG = "#69695C";
const HEADER_FG = "#EEEAE4";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 border-b border-[#69695C]/90 backdrop-blur-md shadow-md"
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

          <nav>
            <ul className="flex items-center gap-8 md:gap-12 text-sm md:text-base">
              <li>
                <Link
                  href="/#tours"
                  className="transition-opacity duration-300 relative pb-1 group hover:opacity-90"
                  style={{ color: HEADER_FG }}
                >
                  <span className="relative z-10 whitespace-nowrap text-inherit">Туры</span>
                  <div
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: HEADER_FG }}
                  />
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                  <span className="relative z-10 whitespace-nowrap text-inherit">Обо мне</span>
                  <div
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: HEADER_FG }}
                  />
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                  <span className="relative z-10 whitespace-nowrap text-inherit">Отзывы</span>
                  <div
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: HEADER_FG }}
                  />
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: HEADER_FG }}
                  />
                </Link>
              </li>
            </ul>
          </nav>

          <div
            className="absolute right-0 bottom-0 top-0 w-px opacity-40 hidden lg:block"
            style={{
              background: `linear-gradient(to bottom, ${HEADER_FG}, transparent, ${HEADER_FG})`,
            }}
          />
        </div>
      </Container>
    </header>
  );
}

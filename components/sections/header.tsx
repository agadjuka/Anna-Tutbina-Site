import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex items-center justify-between py-8">
          <Link href="/" className="text-lg md:text-xl font-semibold tracking-tight">
            Anna Turbina Tours
          </Link>
          <nav>
            <ul className="flex items-center gap-6 md:gap-10 text-sm md:text-base">
              <li>
                <Link href="/#tours" className="hover:text-black text-zinc-600 transition-colors">
                  Туры
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-black text-zinc-600 transition-colors">
                  Обо мне
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-black text-zinc-600 transition-colors">
                  Отзывы
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}



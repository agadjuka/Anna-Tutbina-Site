import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e0db] bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <Container>
        <div className="flex items-center justify-between py-5 md:py-6">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground hover:text-[#bea692] transition-colors duration-300"
          >
            Anna Turbina Tours
          </Link>
          <nav>
            <ul className="flex items-center gap-6 md:gap-10 text-sm md:text-base">
              <li>
                <Link 
                  href="/#tours" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bea692] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Туры
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bea692] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Обо мне
                </Link>
              </li>
              <li>
                <Link 
                  href="/#reviews" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bea692] after:transition-all after:duration-300 hover:after:w-full"
                >
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



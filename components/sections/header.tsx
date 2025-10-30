import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e0db] bg-[#e8e8e8]/65 backdrop-blur-md supports-[backdrop-filter]:bg-[#e8e8e8]/60">
      <Container>
        <div className="relative flex items-center justify-between py-6 md:py-7">
          {/* Декоративная линия слева */}
          <div className="absolute left-0 bottom-0 top-0 w-px bg-gradient-to-b from-[#bea692] via-transparent to-[#bea692] opacity-30 hidden lg:block" />
          
          <Link href="/" className="inline-flex items-center -my-6 md:-my-7 py-6 md:py-7 px-3 md:px-4 text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
            Anna Turbina Tours
          </Link>
          
          <nav>
            <ul className="flex items-center gap-8 md:gap-12 text-sm md:text-base">
              <li>
                <Link 
                  href="/#tours" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 group"
                >
                  <span className="relative z-10">Туры</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#bea692] group-hover:w-full transition-all duration-300" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 group"
                >
                  <span className="relative z-10">Обо мне</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#bea692] group-hover:w-full transition-all duration-300" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/#reviews" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative pb-1 group"
                >
                  <span className="relative z-10">Отзывы</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#bea692] group-hover:w-full transition-all duration-300" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#bea692] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Декоративная линия справа */}
          <div className="absolute right-0 bottom-0 top-0 w-px bg-gradient-to-b from-[#bea692] via-transparent to-[#bea692] opacity-30 hidden lg:block" />
        </div>
      </Container>
    </header>
  );
}



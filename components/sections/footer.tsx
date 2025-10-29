import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Instagram, Send, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e0db] bg-background">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 md:py-20">
          <div className="space-y-4">
            <div className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground">
              Anna Turbina Tours
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
              Эксклюзивные маршруты и персональные путешествия для женщин
            </p>
          </div>

          <nav className="space-y-4">
            <div className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-medium">
              Навигация
            </div>
            <ul className="space-y-3 text-sm md:text-base">
              <li>
                <Link 
                  href="/#tours" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block"
                >
                  Туры
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block"
                >
                  Обо мне
                </Link>
              </li>
              <li>
                <Link 
                  href="/#reviews" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block"
                >
                  Отзывы
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-4">
            <div className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-medium">
              Контакты
            </div>
            <div className="flex flex-col gap-3 text-sm md:text-base">
              <a 
                href="tel:+79999999999" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="p-2 rounded-lg bg-[#e5e0db]/50">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+7 (999) 999-99-99</span>
              </a>
              <a 
                href="mailto:info@annaturbina.tours" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="p-2 rounded-lg bg-[#e5e0db]/50">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@annaturbina.tours</span>
              </a>
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="#" 
                  aria-label="Instagram" 
                  className="p-2 rounded-lg bg-[#e5e0db]/50 text-muted-foreground hover:text-[#bea692] hover:bg-[#e5e0db] transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  aria-label="Telegram" 
                  className="p-2 rounded-lg bg-[#e5e0db]/50 text-muted-foreground hover:text-[#bea692] hover:bg-[#e5e0db] transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-[#e5e0db] py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Anna Turbina Tours. Все права защищены.
      </div>
    </footer>
  );
}



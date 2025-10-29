import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Instagram, Send, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="space-y-2">
            <div className="text-xl md:text-2xl font-semibold tracking-tight">Anna Turbina Tours</div>
            <p className="text-sm md:text-base text-zinc-500">
              Эксклюзивные маршруты и персональные путешествия
            </p>
          </div>

          <nav className="space-y-3">
            <div className="text-xs md:text-sm uppercase tracking-wide text-zinc-500">
              Навигация
            </div>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/#tours" className="hover:text-black transition-colors underline-offset-4 hover:underline">
                  Туры
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-black transition-colors underline-offset-4 hover:underline">
                  Обо мне
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-black transition-colors underline-offset-4 hover:underline">
                  Отзывы
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-3">
            <div className="text-xs md:text-sm uppercase tracking-wide text-zinc-500">
              Контакты
            </div>
            <div className="flex flex-col gap-2 text-sm md:text-base">
              <a href="tel:+79999999999" className="flex items-center gap-2 hover:text-black transition-colors underline-offset-4 hover:underline">
                <Phone className="h-4 w-4" /> +7 (999) 999-99-99
              </a>
              <a href="mailto:info@annaturbina.tours" className="flex items-center gap-2 hover:text-black transition-colors underline-offset-4 hover:underline">
                <Mail className="h-4 w-4" /> info@annaturbina.tours
              </a>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" aria-label="Instagram" className="hover:text-black transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Telegram" className="hover:text-black transition-colors">
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Anna Turbina Tours.
      </div>
    </footer>
  );
}



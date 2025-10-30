import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Send, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e0db] bg-background">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 py-6 md:py-8">
          <div className="space-y-2">
            <div className="text-base md:text-2xl font-heading font-bold tracking-tight text-foreground">
              Anna Turbina Tours
            </div>
            <p className="text-[12.5px] md:text-sm text-muted-foreground leading-snug max-w-sm">
              Эксклюзивные маршруты и персональные путешествия для женщин
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[10.5px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Контакты
            </div>
            <div className="flex flex-col gap-1.5 text-[12px] md:text-[13px]">
              <a 
                href="tel:+79539527212" 
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300 min-h-8"
              >
                <div className="h-8 w-8 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 overflow-visible">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="leading-5">+7 (953) 952-72-12</span>
              </a>
              
              <div className="flex items-center gap-2 pt-0.5">
                <a 
                  href="https://wa.me/79539527212" 
                  aria-label="WhatsApp" 
                  className="h-8 w-8 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground hover:text-[#25D366] hover:bg-[#e5e0db] transition-all duration-300 overflow-visible"
                  target="_blank" rel="noopener noreferrer"
                >
                  <FaWhatsapp className="h-3.5 w-3.5" />
                </a>
                <a 
                  href="https://t.me/Anna_Turbina" 
                  aria-label="Telegram" 
                  className="h-8 w-8 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground hover:text-[#bea692] hover:bg-[#e5e0db] transition-all duration-300 overflow-visible"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Send className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-[#e5e0db] py-4 text-center text-xs text-muted-foreground leading-tight">
        <div className="mb-1">Разработка сайта @markov1u</div>
        <div>© {new Date().getFullYear()} Anna Turbina Tours. Все права защищены.</div>
      </div>
    </footer>
  );
}



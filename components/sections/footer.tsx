import { Container } from "@/components/ui/container";
import Link from "next/link";
import { MessageCircle, Send, Mail, Phone } from "lucide-react";

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
            <div className="flex flex-col gap-2 text-[13px] md:text-sm">
              <a 
                href="tel:+79999999999" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300 min-h-9"
              >
                <div className="h-9 w-9 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 overflow-visible">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="leading-5">+7 (999) 999-99-99</span>
              </a>
              <a 
                href="mailto:info@annaturbina.tours" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300 min-h-9"
              >
                <div className="h-9 w-9 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 overflow-visible">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="leading-5">info@annaturbina.tours</span>
              </a>
              <div className="flex items-center gap-2.5 pt-1">
                <a 
                  href="https://wa.me/79999999999" 
                  aria-label="WhatsApp" 
                  className="h-9 w-9 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground hover:text-[#25D366] hover:bg-[#e5e0db] transition-all duration-300 overflow-visible"
                  target="_blank" rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a 
                  href="#" 
                  aria-label="Telegram" 
                  className="h-9 w-9 p-1 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground hover:text-[#bea692] hover:bg-[#e5e0db] transition-all duration-300 overflow-visible"
                >
                  <Send className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-[#e5e0db] py-4 text-center text-xs text-muted-foreground leading-tight">
        © {new Date().getFullYear()} Anna Turbina Tours. Все права защищены.
      </div>
    </footer>
  );
}



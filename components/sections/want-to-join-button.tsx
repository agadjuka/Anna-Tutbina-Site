"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function WantToJoinButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center pt-8 md:pt-10 pb-0 gap-6">
      <div className="relative flex flex-col items-center gap-4">
        {/* Иконки Telegram и WhatsApp */}
        <div className="flex items-center gap-4">
          <Link
            href="https://t.me/Anna_Turbina"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
            className={
              "h-14 w-14 md:h-16 md:w-16 p-3 shrink-0 flex items-center justify-center rounded-full bg-[#e5e0db] text-muted-foreground transition-all overflow-visible shadow-lg" +
              (open
                ? " opacity-100 translate-y-0 scale-100 duration-300 hover:text-[#0088cc] hover:bg-[#e5e0db] hover:scale-110 hover:shadow-xl"
                : " opacity-0 translate-y-4 pointer-events-none duration-200 scale-90")
            }
            style={{ transitionProperty: "opacity, transform, background-color, color" }}
            onClick={() => setOpen(false)}
          >
            <Send className="h-7 w-7 md:h-8 md:w-8" />
          </Link>
          <Link
            href="https://wa.me/79539527212"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
            className={
              "h-14 w-14 md:h-16 md:w-16 p-3 shrink-0 flex items-center justify-center rounded-full bg-[#e5e0db] text-muted-foreground transition-all overflow-visible shadow-lg" +
              (open
                ? " opacity-100 translate-y-0 scale-100 duration-500 hover:text-[#25D366] hover:bg-[#e5e0db] hover:scale-110 hover:shadow-xl"
                : " opacity-0 translate-y-4 pointer-events-none duration-200 scale-90")
            }
            style={{ transitionProperty: "opacity, transform, background-color, color" }}
            onClick={() => setOpen(false)}
          >
            <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
          </Link>
        </div>

        {/* Главная кнопка "Хочу с Вами!" */}
        <button
          aria-label="Хочу с Вами!"
          title="Хочу с Вами!"
          aria-pressed={open}
          onClick={() => setOpen((v) => !v)}
          className="relative inline-flex items-center justify-center gap-2 px-10 py-5 md:px-12 md:py-6 text-lg md:text-xl font-medium text-white rounded-full bg-gradient-to-r from-[#bea692] via-[#c8b39e] to-[#bea692] shadow-2xl hover:shadow-[#bea692]/40 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-[#bea692]/30 overflow-hidden group"
          style={{
            backgroundSize: "200% 100%",
            animation: open ? "none" : "gradient-shift 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite",
          }}
        >
          {/* Анимированный градиентный фон */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, #bea692 0%, #d4c4b0 50%, #bea692 100%)",
              backgroundSize: "200% 100%",
              animation: "gradient-shift 3s ease-in-out infinite",
            }}
          />

          {/* Блестящий эффект при наведении */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              transform: "translateX(-100%) translateY(-100%)",
              animation: "shimmer 2s infinite",
            }}
          />

          {/* Концентрические кольца для эффекта пульсации */}
          {!open && (
            <>
              <span
                className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0"
                style={{
                  animation: "ring-pulse 2s ease-out infinite",
                }}
              />
              <span
                className="absolute inset-0 rounded-full border-2 border-white/15 opacity-0"
                style={{
                  animation: "ring-pulse 2s ease-out infinite 0.3s",
                }}
              />
              <span
                className="absolute inset-0 rounded-full border-2 border-white/10 opacity-0"
                style={{
                  animation: "ring-pulse 2s ease-out infinite 0.6s",
                }}
              />
            </>
          )}

          {/* Содержимое кнопки */}
          <span className="relative z-10 flex items-center gap-2">
            <Heart
              className="h-5 w-5 md:h-6 md:w-6"
              fill="currentColor"
            />
            <span>Хочу с Вами!</span>
          </span>
        </button>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(190, 166, 146, 0.4), 0 0 40px rgba(190, 166, 146, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(190, 166, 146, 0.6), 0 0 60px rgba(190, 166, 146, 0.3);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
          }
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}


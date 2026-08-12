"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface ContactItem {
  label?: string;
  url?: string;
  icon?: string;
}

interface WantToJoinButtonProps {
  contacts: ContactItem[];
}

const ICON_MAP = {
  telegram: Send,
  whatsapp: FaWhatsapp,
} as const;

export function WantToJoinButton({ contacts }: WantToJoinButtonProps) {
  const [open, setOpen] = useState(false);

  if (!contacts || contacts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-8 md:pt-10 pb-0 gap-6">
      <div className="relative flex flex-col items-center gap-4">
        {/* Иконки контактов */}
        <div className="flex items-center gap-4">
          {contacts.map((contact, index) => {
            if (!contact.url || !contact.label) return null;

            const IconComponent = contact.icon ? ICON_MAP[contact.icon as keyof typeof ICON_MAP] : null;
            const isWhatsApp = contact.icon === 'whatsapp';

            return (
              <Link
                key={index}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact.label}
                title={contact.label}
                className={
                  "h-14 w-14 md:h-16 md:w-16 p-3 shrink-0 flex items-center justify-center rounded-full bg-muted text-muted-foreground transition-all overflow-visible shadow-lg" +
                  (open
                    ? ` opacity-100 translate-y-0 scale-100 duration-${isWhatsApp ? '500' : '300'} hover:text-${isWhatsApp ? '[#25D366]' : 'primary'} hover:bg-muted hover:scale-110 hover:shadow-xl`
                    : " opacity-0 translate-y-4 pointer-events-none duration-200 scale-90")
                }
                style={{ transitionProperty: "opacity, transform, background-color, color" }}
                onClick={() => setOpen(false)}
              >
                {IconComponent && <IconComponent className="h-7 w-7 md:h-8 md:w-8" />}
              </Link>
            );
          })}
        </div>

        {/* Главная кнопка "Хочу с Вами!" */}
        <button
          aria-label="Хочу с Вами!"
          title="Хочу с Вами!"
          aria-pressed={open}
          onClick={() => setOpen((v) => !v)}
          className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary via-primary-dark to-primary px-10 py-5 text-lg font-medium text-white shadow-2xl transition-all duration-500 hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background group md:px-12 md:py-6 md:text-xl"
          style={{
            backgroundSize: "200% 100%",
            animation: open ? "none" : "gradient-shift 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite",
          }}
        >
          {/* Анимированный градиентный фон */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary-light) 50%, var(--color-primary-dark) 100%)",
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
            box-shadow: 0 0 20px rgba(105, 105, 92, 0.35), 0 0 40px rgba(105, 105, 92, 0.18);
          }
          50% {
            box-shadow: 0 0 30px rgba(105, 105, 92, 0.5), 0 0 60px rgba(105, 105, 92, 0.25);
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

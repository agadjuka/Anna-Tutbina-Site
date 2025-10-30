"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export function FloatingContacts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-[60] right-4 bottom-4 md:right-8 md:bottom-8">
      <div className="relative flex flex-col items-end gap-3">
        {/* Дочерние кнопки-иконки в стиле футера */}
        <div className="flex flex-col items-end gap-2">
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
            className={
              "h-10 w-10 md:h-11 md:w-11 p-1.5 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground transition-all overflow-visible" +
              (open
                ? " opacity-100 translate-y-0 duration-300 hover:text-[#bea692] hover:bg-[#e5e0db] scale-100"
                : " opacity-0 translate-y-2 pointer-events-none duration-200 scale-95")
            }
            style={{ transitionProperty: "opacity, transform, background-color, color" }}
          >
            <Send className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
            className={
              "h-10 w-10 md:h-11 md:w-11 p-1.5 shrink-0 flex items-center justify-center rounded-md bg-[#e5e0db]/50 text-muted-foreground transition-all overflow-visible" +
              (open
                ? " opacity-100 translate-y-0 duration-500 hover:text-[#25D366] hover:bg-[#e5e0db] scale-100"
                : " opacity-0 translate-y-2 pointer-events-none duration-200 scale-95")
            }
            style={{ transitionProperty: "opacity, transform, background-color, color" }}
          >
            <FaWhatsapp className="h-4 w-4" />
          </Link>
        </div>

        {/* Главная плавающая кнопка: иконка чата с мягкой пульсацией */}
        <button
          aria-label="Связаться"
          title="Связаться"
          aria-pressed={open}
          onClick={() => setOpen((v) => !v)}
          className={
            "relative inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#bea692] text-white shadow-card-elevated transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-[#bea692] focus:ring-offset-2 hover:shadow-card-hover" +
            (open ? " rotate-12" : " rotate-0")
          }
        >
          {/* Базовое периметр-кольцо (всегда видно) */}
          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/35 opacity-60" aria-hidden />
          <span className="pointer-events-none absolute inset-1 rounded-full border border-white/20 opacity-60" aria-hidden />

          {/* Иконка: чёткая смена между чат и крестик */}
          <span className="relative inline-flex items-center justify-center">
            {/* Иконка чата (закрыто) */}
            <span className={"absolute transition-all duration-200 " + (open ? "opacity-0 scale-75 rotate-6" : "opacity-100 scale-100 rotate-0")}>
              <MessageSquareText className="h-6 w-6 md:h-7 md:w-7" />
            </span>
            {/* Иконка закрытия (открыто) */}
            <span className={"absolute transition-all duration-200 " + (open ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-6")}>
              {/* рисуем крест двумя полосками для согласованности стиля */}
              <span className="relative block h-6 w-6 md:h-7 md:w-7">
                <span className="absolute left-1/2 top-1/2 h-[2px] w-5 md:w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
                <span className="absolute left-1/2 top-1/2 h-[2px] w-5 md:w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
              </span>
            </span>
            {/* Контейнер для выравнивания размеров */}
            <span className="opacity-0">
              <MessageSquareText className="h-6 w-6 md:h-7 md:w-7" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}



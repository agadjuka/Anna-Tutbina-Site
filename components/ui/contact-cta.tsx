"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface ContactItem {
  label?: string;
  url?: string;
  icon?: string;
}

interface ContactCtaProps {
  label: string;
  contacts: ContactItem[];
  className?: string;
  /** `light` — светлая обводка для тёмной (primary) подложки, `dark` — наоборот. */
  tone?: "light" | "dark";
}

const ICON_MAP = {
  telegram: Send,
  whatsapp: FaWhatsapp,
} as const;

/**
 * Кнопка-призыв, которая по клику раскрывает реальные контакты (Telegram/WhatsApp),
 * по образцу «Хочу с Вами!» на страницах туров — но в стилистике редизайна главной
 * (плоская пилюля с обводкой вместо градиентной кнопки со свечением).
 */
export function ContactCta({ label, contacts, className, tone = "light" }: ContactCtaProps) {
  const [open, setOpen] = useState(false);

  const base =
    "inline-flex h-12 items-center justify-center rounded-full px-7 text-[13px] font-semibold tracking-[0.02em] transition-colors duration-300 lg:h-[calc(30.48*var(--ona-u))] lg:w-[calc(106*var(--ona-u))] lg:px-0 lg:text-[calc(11*var(--ona-u))]";

  const toneClasses =
    tone === "light"
      ? "border border-on-primary text-on-primary hover:bg-on-primary hover:text-primary"
      : "border border-primary text-primary hover:bg-primary hover:text-on-primary";

  return (
    /* `lg:relative` + `lg:absolute` у ряда контактов: раскрытые Telegram/WhatsApp
       выпадают ПОВЕРХ контента, ничего не раздвигая (просьба заказчика) —
       даже скрытый (`opacity-0`) ряд в потоке резервировал место и сдвигал
       теги под кнопкой. Ширина кнопки 106 — как у «Наши ценности»: при
       ширине по макету текст «Обсудить идею» в неё не влезал. */
    <div className={cn("flex flex-col items-center gap-4 lg:relative lg:items-start", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(base, toneClasses)}
      >
        {label}
      </button>

      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-300 lg:absolute lg:left-0 lg:top-full lg:z-20 lg:mt-[calc(12*var(--ona-u))]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        {contacts.map((contact, index) => {
          if (!contact.url || !contact.label) return null;

          const IconComponent = contact.icon ? ICON_MAP[contact.icon as keyof typeof ICON_MAP] : null;

          return (
            <Link
              key={index}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-medium transition-colors duration-300",
                tone === "light"
                  ? "bg-on-primary text-primary hover:bg-background"
                  : "bg-primary text-on-primary hover:bg-primary-dark"
              )}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {contact.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

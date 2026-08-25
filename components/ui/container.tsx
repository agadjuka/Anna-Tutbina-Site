import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Ширина контента.
   *
   * `default` — `max-w-screen-xl` (1280px), как было и остаётся почти везде.
   * `wide` — 1578px (контент от x=171 до 1749 при 1920): в макете Figma ширина
   * контента разная по блокам, и часть
   * из них (GUESTS «Нам по пути», VALUES) заметно шире 1280. Пока всё было
   * зажато одним контейнером, текст этих блоков стоял правее макета, а коллаж
   * фотографий сжимался и обрезал людей по краям — правка заказчика, см.
   * `docs/redesign/client-feedback-2026-08.md`, пп. 3.4–3.5.
   *
   * Отдельную обёртку ширины по-прежнему заводить не надо (правило
   * `docs/design-system.md`) — нужна другая ширина, добавляйте её сюда.
   */
  size?: "default" | "wide";
}

const MAX_WIDTH: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-screen-xl",
  wide: "max-w-[1578px]",
};

export function Container({ children, className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      // `data-container` — зацепка для закона масштабирования главной: на `/`
      // ширина контента задаётся одним множителем (`1216 * --ona-u` в
      // `globals.css`), а не этими максимумами. На остальных страницах
      // атрибут ни на что не влияет — правило заперто под `html[data-ona-scale]`.
      data-container={size}
      className={cn(MAX_WIDTH[size], "mx-auto px-4 md:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}




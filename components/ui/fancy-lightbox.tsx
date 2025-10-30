"use client";

import Lightbox, { type Slide, type Render } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { CSSProperties, ReactNode } from "react";

interface FancyLightboxProps {
  open: boolean;
  slides: Slide[];
  index?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  captionRenderer?: Render["slide"];
}

/**
 * Обёртка над YARL с современным стилем:
 * — стеклянная полупрозрачная подложка с блюром
 * — мягкие анимации, округлые углы, тени у изображения
 * — миниатюры, зум, фуллскрин, слайдшоу, счётчик, подписи
 */
export function FancyLightbox({
  open,
  slides,
  index,
  onClose,
  onIndexChange,
  captionRenderer,
}: FancyLightboxProps) {
  const containerStyle: CSSProperties = {
    backgroundColor: "rgba(10, 10, 12, 0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };

  const slideStyle: CSSProperties = {
    borderRadius: 16,
    boxShadow:
      "0 10px 30px rgba(0,0,0,.35), 0 2px 10px rgba(0,0,0,.15)",
    overflow: "hidden",
  };

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      carousel={{ finite: false, padding: 24, imageFit: "contain" }}
      controller={{ closeOnBackdropClick: true }}
      on={{ view: ({ index }) => onIndexChange?.(index) }}
      styles={{
        container: containerStyle,
        slide: slideStyle,
        button: { display: "none" }, // скрываем все стандартные кнопки
      }}
      render={{
        slide: captionRenderer as unknown as Render["slide"] | undefined,
        buttonPrev: () => null,
        buttonNext: () => null,
        buttonClose: () => null,
      }}
      // Без плагинов: максимально чистый интерфейс
      animation={{ fade: 300, swipe: 300 }}
    />
  );
}

export default FancyLightbox;



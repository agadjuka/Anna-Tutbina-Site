"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoMediaProps {
  /** Широкий файл (≈1.9:1) — десктоп и планшет. */
  wideSrc: string;
  /** Тот же ролик, кадрированный в 4:3 и легче по весу — телефон. */
  narrowSrc: string;
  widePoster: string;
  narrowPoster: string;
}

/**
 * Проигрыватель фонового видео HERO главной — единственный клиентский кусок
 * видео-HERO.
 *
 * Зачем вообще клиентский компонент. Нужно отдавать телефону лёгкий файл
 * (0.8 МБ вместо 3.4 МБ), а способов сделать это разметкой нет:
 *
 * - `<source media="…">` внутри `<video>` браузеры для видео не поддерживают
 *   (это работает только в `<picture>`), выбирается всегда первый источник;
 * - два `<video>` под `hidden`/`lg:block` тоже не годятся: `autoplay`
 *   перебивает `preload="none"`, и скрытый ролик всё равно качается.
 *
 * Поэтому источник выбирается один раз на маунте по ширине окна. Слушателя
 * `resize` намеренно НЕТ: смена `src` перезапускает воспроизведение с нуля, а
 * пересечение брейкпоинта мышкой посреди просмотра — случай куда более редкий,
 * чем дёрганый рестарт при каждом изменении размера окна.
 *
 * ⚠️ ПОСТЕР — ОТДЕЛЬНЫЙ СЛОЙ `<picture>`, а не атрибут `poster` у `<video>`.
 * Так вылечен чёрный экран (жалоба Ильи 2026-09-07): постер на самом `<video>`
 * прятался вместе с ним, пока элемент ждал `canplay` под `opacity: 0`, и до
 * этого события на первом экране не было ничего. Отдельный слой рендерится
 * сервером, виден сразу и не зависит ни от JS, ни от событий видео; `<source
 * media>` для картинок браузеры поддерживают (в отличие от видео), поэтому
 * пропорция постера сразу правильная для этой ширины.
 *
 * Видео лежит поверх и проявляется по `canplay`. Прятать его — только явным
 * `data-ready="false"`: по умолчанию оно видимо, чтобы потеря CSS-правила или
 * несработавшее событие стоили пропущенной анимации, а не пустого экрана.
 */
export function HeroVideoMedia({
  wideSrc,
  narrowSrc,
  widePoster,
  narrowPoster,
}: HeroVideoMediaProps) {
  const [source, setSource] = useState<{ src: string; poster: string } | null>(null);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setSource(
      wide ? { src: wideSrc, poster: widePoster } : { src: narrowSrc, poster: narrowPoster }
    );
  }, [wideSrc, narrowSrc, widePoster, narrowPoster]);

  /* `canplay` может успеть выстрелить до навешивания обработчика (файл в кэше,
     повторный заход) — тогда событие мы просто не увидим и видео навсегда
     осталось бы прозрачным. Поэтому состояние проверяется ещё и напрямую. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    if (video.readyState >= 3) setReady(true);
  }, [source]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- постер лежит
          статикой в public/ и должен быть виден в первом же кадре, до всякого
          JS; оптимизатор `next/image` тут только добавил бы точку отказа. */}
      <picture className="hero-video__poster" aria-hidden="true">
        <source media="(min-width: 768px)" srcSet={widePoster} />
        <img src={narrowPoster} alt="" />
      </picture>

      <video
        ref={videoRef}
        className="hero-video__video"
        data-ready={ready ? "true" : "false"}
        src={source?.src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setReady(true)}
        onLoadedData={() => setReady(true)}
        onPlaying={() => setReady(true)}
      />
    </>
  );
}

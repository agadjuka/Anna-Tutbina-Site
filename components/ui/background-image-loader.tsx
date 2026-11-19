"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Сколько картинок тянем одновременно: чтобы фоновая подгрузка не отнимала канал у того, что пользователь делает прямо сейчас. */
const BATCH = 3;
/** Сколько ждём одну пачку, прежде чем пойти дальше (медленный/зависший ответ не должен тормозить очередь). */
const BATCH_TIMEOUT_MS = 8000;
/** Повторные проходы: часть картинок появляется в DOM позже (галерея считает ряды в эффекте). */
const PASSES = 3;

/**
 * Фоновая подгрузка всех картинок страницы.
 *
 * Зачем: браузер грузит `loading="lazy"` только когда картинка подъехала почти к
 * экрану. Для карусели это значит, что фото за краем появляются с задержкой в
 * момент листания. Здесь — когда страница уже загрузилась и браузер простаивает,
 * лениво-помеченные картинки переключаются в `eager` пачками по несколько штук.
 *
 * Почему без ущерба: ждём `load` окна и простоя, первый экран не трогаем (он и
 * так грузится по приоритету); тянем по `BATCH` штук, а не все сразу; не
 * запускаем на экономии трафика и медленной сети; пропускаем картинки без
 * раскладки (скрытая ветка `lg:hidden` / `hidden lg:block` — иначе грузили бы
 * вторую копию для другого экрана).
 */
export function BackgroundImageLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;

    let cancelled = false;
    const timers: number[] = [];

    const loadBatch = (batch: HTMLImageElement[]) =>
      new Promise<void>((resolve) => {
        let left = batch.length;
        const done = () => {
          if (--left <= 0) resolve();
        };
        timers.push(window.setTimeout(resolve, BATCH_TIMEOUT_MS));
        batch.forEach((img) => {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          img.loading = "eager";
          if (img.complete) done();
        });
      });

    const pass = async () => {
      const pending = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')).filter(
        (img) => !img.complete && img.getClientRects().length > 0
      );
      for (let i = 0; i < pending.length && !cancelled; i += BATCH) {
        await loadBatch(pending.slice(i, i + BATCH));
      }
    };

    const start = async () => {
      for (let p = 0; p < PASSES && !cancelled; p++) {
        await pass();
        await new Promise((r) => timers.push(window.setTimeout(r, 1200)));
      }
    };

    const schedule = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(() => void start(), { timeout: 3000 });
      else timers.push(window.setTimeout(() => void start(), 800));
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  return null;
}

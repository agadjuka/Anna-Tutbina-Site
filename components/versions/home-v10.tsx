import { HomeLight } from "@/components/home/home-light";
import type { HomeData } from "@/lib/home-data";

/**
 * Версия 10 — версия 8 (та же вёрстка и тот же масштаб) с одним отличием:
 * первый экран собран из видео, а не из bento-коллажа пяти фото. ВЫБРАНА:
 * с 2026-09-11 это и есть боевая главная (`app/page.tsx`), здесь остался
 * только просмотр в рамках архива версий.
 * Разбор раскладок и хранения файлов — в `components/sections/hero-section-video.tsx`.
 */
export function HomeV10({ data }: { data: HomeData }) {
  return <HomeLight data={data} scale="v8" hero="video" />;
}

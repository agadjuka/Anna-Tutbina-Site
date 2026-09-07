import { HomeLight } from "@/components/home/home-light";
import type { HomeData } from "@/lib/home-data";

/**
 * Версия 10 — боевая главная (та же вёрстка и тот же масштаб v8) с одним
 * отличием: первый экран собран из видео, а не из bento-коллажа пяти фото.
 * Разбор раскладок и хранения файлов — в `components/sections/hero-section-video.tsx`.
 */
export function HomeV10({ data }: { data: HomeData }) {
  return <HomeLight data={data} scale="v8" hero="video" />;
}

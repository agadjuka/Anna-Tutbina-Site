import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getHomeData } from "@/lib/home-data";
import { HomeLight } from "@/components/home/home-light";

/** Список туров и отзывы должны совпадать с Sanity без устаревшего статического кэша. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Главная",
  description: "Авторские женские туры и ретриты с Анной Турбиной. Изучайте мир вместе с нами.",
  alternates: {
    canonical: "/",
  },
};

/**
 * Боевая главная. Вёрстка — `components/home/home-light.tsx`, данные — общий
 * `getHomeData()`.
 *
 * Размеры — облегчённые, согласованы заказчиком 25.08.2026 (закон одного
 * множителя, `:root { --ona-u }` в `globals.css`). Первый экран — видео
 * (решение Ильи 11.09.2026). ⚠️ Этот HERO НЕ полноэкранный: по высоте он равен
 * ролику — сознательное отступление, разбор в `docs/redesign/video-hero.md`.
 */
export default async function HomePage() {
  noStore();
  const data = await getHomeData();

  return <HomeLight data={data} />;
}

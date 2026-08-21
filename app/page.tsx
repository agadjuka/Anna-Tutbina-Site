import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getHomeData } from "@/lib/home-data";
import { HomeV6 } from "@/components/versions/home-v6";

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
 * Боевая главная = **версия 6** (согласована заказчиком, 2026-08-20). Вёрстка
 * живёт в `components/versions/home-v6.tsx` — тот же самый компонент, который
 * показывался как «Версия 6» на странице сравнения, без копирования кода.
 *
 * Версии 1–5 остались в `components/versions/` только как черновики для
 * сравнения и скрыты с хаба (`lib/versions.ts`, статус `archived`). План их
 * удаления — `docs/versions-cleanup-plan.md`.
 *
 * Данные грузятся общим `getHomeData()`.
 */
export default async function HomePage() {
  noStore();
  const data = await getHomeData();

  return <HomeV6 data={data} />;
}

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
 * Боевая главная = **версия 10: облегчённая «версия 8» с видео на первом экране**
 * (решение Ильи 2026-09-11). Вёрстка живёт в `components/home/home-light.tsx` —
 * тот же самый компонент, что и на странице сравнения, без копирования кода.
 *
 * - `scale="v8"` включает CSS-слой уменьшенной типографики и отступов
 *   (`html[data-ona-scale]` в `globals.css`) — согласован заказчиком 25.08;
 * - `hero="video"` ставит первым экраном фоновый ролик вместо bento-коллажа из
 *   пяти фото. ⚠️ Этот HERO НЕ полноэкранный — по высоте он равен видео, это
 *   сознательное отступление от правила, разбор в `docs/redesign/video-hero.md`.
 *
 * Прежняя главная (с 25.08 по 11.09 — тот же v8, но с коллажем) не удалена:
 * это `HomeLight` без пропа `hero`, её показывает архивная «Версия 8»
 * (`/admin/versions/v8`). Вернуть коллаж = убрать `hero="video"` ниже.
 *
 * Все записи в `lib/versions.ts` в статусе `archived`, хаб `/versions` пуст.
 * Ничего из `components/versions/` боевая главная не импортирует — план
 * удаления папки в `docs/versions-cleanup-plan.md`.
 *
 * Данные грузятся общим `getHomeData()`.
 */
export default async function HomePage() {
  noStore();
  const data = await getHomeData();

  return <HomeLight data={data} scale="v8" hero="video" />;
}

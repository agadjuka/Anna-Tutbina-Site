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
 * Боевая главная = **облегчённый вариант «версия 8»** (согласован заказчиком,
 * 2026-08-25). Вёрстка живёт в `components/home/home-light.tsx` — тот же самый
 * компонент, который показывался как «Версия 8» на странице сравнения, без
 * копирования кода. `scale="v8"` включает CSS-слой уменьшенной типографики и
 * отступов (`html[data-ona-scale]` в `globals.css`).
 *
 * Сравнение версий на этом закончено: ВСЕ записи в `lib/versions.ts` переведены
 * в статус `archived` — с хаба `/versions` они пропали, прямые ссылки
 * `/admin/versions/v1…v9` ещё работают. Ничего из `components/versions/` боевая
 * главная больше не импортирует, папку можно удалить целиком — план в
 * `docs/versions-cleanup-plan.md`.
 *
 * Данные грузятся общим `getHomeData()`.
 */
export default async function HomePage() {
  noStore();
  const data = await getHomeData();

  return <HomeLight data={data} scale="v8" />;
}

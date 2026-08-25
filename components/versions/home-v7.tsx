import { HomeLight } from "@/components/home/home-light";
import type { HomeData } from "@/lib/home-data";

/** Компактная — тот же макет, просто ужат (см. docs/redesign/lightweight-scale-plan.md). */
export function HomeV7({ data }: { data: HomeData }) {
  return <HomeLight data={data} scale="v7" />;
}

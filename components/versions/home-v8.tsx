import { HomeLight } from "@/components/home/home-light";
import type { HomeData } from "@/lib/home-data";

/** Лёгкая — буквально то, о чём просил заказчик (см. docs/redesign/lightweight-scale-plan.md). */
export function HomeV8({ data }: { data: HomeData }) {
  return <HomeLight data={data} scale="v8" />;
}

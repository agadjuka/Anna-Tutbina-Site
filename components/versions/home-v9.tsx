import { HomeLight } from "@/components/versions/home-light";
import type { HomeData } from "@/lib/home-data";

/** Воздушная — кегли как у v8, но больше воздуха вокруг текста (см. docs/redesign/lightweight-scale-plan.md). */
export function HomeV9({ data }: { data: HomeData }) {
  return <HomeLight data={data} scale="v9" />;
}

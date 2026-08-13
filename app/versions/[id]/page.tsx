import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getHomeData } from "@/lib/home-data";
import { VERSIONS, getVersion } from "@/lib/versions";
import { VERSION_COMPONENTS } from "@/components/versions/registry";
import { VersionBadge } from "@/components/versions/version-badge";
import { ForceMotion } from "@/components/versions/force-motion";

/** Контент тянется из Sanity — как и на боевой главной, без статического кэша. */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return VERSIONS.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const version = getVersion(id);

  return {
    title: version ? version.title : "Версия не найдена",
    robots: { index: false, follow: false },
  };
}

/**
 * Рендерит выбранную версию главной: плашка сверху + сама версия.
 * Ничего не знает о конкретных версиях — берёт их из реестра.
 */
export default async function VersionPage({ params }: { params: Promise<{ id: string }> }) {
  noStore();

  const { id } = await params;
  const version = getVersion(id);
  const VersionComponent = VERSION_COMPONENTS[id];

  // Запись в реестре без компонента (или наоборот) — это ошибка конфигурации,
  // а не «страницы нет»; но для посетителя это всё равно 404.
  if (!version || !VersionComponent) notFound();

  const data = await getHomeData();

  return (
    <>
      <ForceMotion />
      <VersionBadge version={version} />
      <VersionComponent data={data} />
    </>
  );
}

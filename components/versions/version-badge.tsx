import { SmartLink } from "@/components/ui/smart-link";
import type { VersionMeta } from "@/lib/versions";

/**
 * Метка версии — маленькая кнопка-пилюля, а не полоса во всю ширину экрана
 * (была раньше, перекрывала верх HERO и выглядела как часть сайта, а не как
 * служебная метка для сравнения версий). Весь бейдж — одна ссылка назад к
 * `/versions`: кликабельно как кнопка, а не просто подпись рядом со ссылкой.
 *
 * `fixed`, а не `sticky` — ничего не сдвигает поток документа, просто лежит
 * поверх контента (в т.ч. поверх HERO). Отступ от правого края учитывает
 * safe-area (челюсть/индикатор жестов на телефоне).
 */
export function VersionBadge({ version }: { version: VersionMeta }) {
  return (
    <SmartLink
      href="/versions"
      className="fixed z-[70] flex items-center gap-1.5 rounded-full bg-foreground/90 px-3.5 py-2 text-[11px] font-medium text-background shadow-lg backdrop-blur-sm transition-opacity hover:opacity-80"
      style={{
        top: "calc(var(--header-height, 0px) + 12px)",
        right: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
      title={version.title}
    >
      <span aria-hidden="true">←</span>
      <span className="max-w-[38vw] truncate uppercase tracking-[0.06em] sm:max-w-none">
        {version.title}
        {version.status === "draft" && " · черновик"}
      </span>
    </SmartLink>
  );
}

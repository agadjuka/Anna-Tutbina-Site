import { cn } from "@/lib/utils";
import type { SocialPlatform } from "@/lib/home-data";

/**
 * Иконки соцсетей для диптиха создателей (заказчик прислал SVG 11.09.2026,
 * исходники `ona-{instagram,telegram,youtube}.svg`, 512×512, контурные).
 *
 * Отличия от исходников:
 * - цвет — `currentColor`, а не зашитый `#FFFFFF`: цвет и прозрачность задаёт
 *   токен в месте вызова (иначе на светлом фоне иконка просто пропадала бы);
 * - самолётик Telegram уменьшен до 88% и сдвинут к центру: в исходнике он
 *   занимает ~80% ширины бокса против ~66% у Instagram и читался заметно
 *   крупнее соседей. Толщина линий при этом компенсирована (26 → 29.5 и
 *   23 → 26 до масштаба), чтобы на экране она осталась как в исходнике.
 */
const PATHS: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round">
      <rect x={86} y={86} width={340} height={340} rx={92} />
      <circle cx={256} cy={256} r={82} />
      <circle cx={355} cy={157} r={18} fill="currentColor" stroke="none" />
    </g>
  ),
  telegram: (
    <g
      transform="translate(256 256) scale(0.88) translate(-268 -254)"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        strokeWidth={29.5}
        d="M450 78 65 226c-20 8-19 22 4 30l98 31 38 119c6 19 15 24 30 9l55-54 107 79c20 12 34 3 39-19L472 102c7-25-4-35-22-24Z"
      />
      <path strokeWidth={26} d="m167 287 242-151-178 181-18 70" />
    </g>
  ),
  youtube: (
    <g fill="none" stroke="currentColor" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round">
      <rect x={62} y={112} width={388} height={288} rx={78} />
      <path d="M218 181v150l126-75-126-75Z" fill="currentColor" stroke="none" />
    </g>
  ),
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  telegram: "Telegram",
  youtube: "YouTube",
};

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && value in PATHS;
}

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
    >
      {PATHS[platform]}
    </svg>
  );
}

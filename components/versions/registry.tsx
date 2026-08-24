import type { HomeData } from "@/lib/home-data";
import { HomeV1 } from "./home-v1";
import { HomeV2 } from "./home-v2";
import { HomeV3 } from "./home-v3";
import { HomeV4 } from "./home-v4";
import { HomeV5 } from "./home-v5";
import { HomeV6 } from "./home-v6";
import { HomeV7 } from "./home-v7";
import { HomeV8 } from "./home-v8";
import { HomeV9 } from "./home-v9";

/**
 * Связка «id версии → компонент». Второе (и последнее) место, которое правится
 * при добавлении версии — первое это `lib/versions.ts`. См. `docs/VERSIONS.md`.
 *
 * Вынесено из `lib/versions.ts`, чтобы там остались чистые метаданные без
 * импорта React-компонентов.
 */
export const VERSION_COMPONENTS: Record<string, (props: { data: HomeData }) => React.ReactNode> = {
  v1: HomeV1,
  v2: HomeV2,
  v3: HomeV3,
  v4: HomeV4,
  v5: HomeV5,
  v6: HomeV6,
  v7: HomeV7,
  v8: HomeV8,
  v9: HomeV9,
};

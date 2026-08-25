import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

/**
 * `useCdn: true` — запросы идут в `apicdn.sanity.io` (CDN Sanity) вместо
 * `api.sanity.io` (origin). Включено 2026-08-25: до этого каждый GROQ-запрос
 * бил в origin, а их на одну загрузку главной уходит шесть.
 *
 * ⚠️ Свежесть контента при этом НЕ страдает, и это важно — по роутам намеренно
 * расставлены `force-dynamic`/`noStore()`, чтобы заказчик видел правки из
 * Studio сразу (см. комментарий в `app/page.tsx`). CDN Sanity сбрасывается
 * САМ в момент публикации документа, а не по таймеру: отдаётся только уже
 * опубликованный контент, и после публикации следующий же запрос получает
 * новую версию. Отставания, как у обычного time-based кэша, здесь нет.
 *
 * Где `useCdn: true` был бы НЕПРАВИЛЬНЫМ и о чём помнить, если появится такой
 * код: черновики (`drafts.*`, перспектива `previewDrafts`) и любые запросы с
 * токеном авторизации — CDN их не обслуживает. Сейчас таких запросов в проекте
 * нет, все шесть читают опубликованные документы без токена.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}




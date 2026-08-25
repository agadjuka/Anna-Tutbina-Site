import { cache } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";

export interface SiteSettingsContact {
  label?: string;
  url?: string;
  icon?: string;
}

export interface SiteSettings {
  slogan?: string;
  contactLinks?: Array<{ label?: string; url?: string }>;
  communityLinks?: Array<{ label?: string; url?: string }>;
  footerNote?: string;
  primaryContacts?: SiteSettingsContact[];
}

/**
 * Настройки сайта — ОДИН запрос на рендер, а не по одному на каждого потребителя.
 *
 * `siteSettingsQuery` нужен трём независимым местам: футеру, плавающей кнопке
 * контактов и `getHomeData()` (оттуда `primaryContacts` уходят в COLLAB). Все
 * три — серверные компоненты, каждый звал `sanityClient.fetch` сам, и запрос
 * уходил в Sanity ТРИЖДЫ за одну загрузку страницы. Это не догадка: замер
 * 2026-08-25 с временной инструментацией клиента показал на главной 8 запросов,
 * из них три одинаковых `siteSettings`.
 *
 * Автоматическая мемоизация `fetch` у Next здесь не срабатывает — клиент
 * `next-sanity` ходит своим путём, и одинаковые запросы не схлопываются.
 * Поэтому дедупликация явная, через `React.cache()`: он мемоизирует результат
 * на время ОДНОГО серверного рендера (одного запроса пользователя), а между
 * запросами ничего не хранит.
 *
 * ⚠️ Это НЕ кэширование между запросами и оно не конфликтует с `noStore()` /
 * `force-dynamic`, которые расставлены по роутам намеренно (заказчик правит
 * контент в Studio и должен видеть результат сразу — см. комментарий в
 * `app/page.tsx`). Свежесть данных не меняется: как ходили в Sanity на каждый
 * запрос страницы, так и ходим — просто один раз вместо трёх.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
});

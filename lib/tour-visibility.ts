/**
 * Видимость тура на публичном сайте (поле hideFromSite в Sanity).
 * Документы без поля считаются опубликованными (как до появления флага).
 */
export function isTourVisibleOnSite(
  hideFromSite: boolean | null | undefined
): boolean {
  return hideFromSite !== true;
}

/** Условие GROQ: тур показывается в списках и доступен по URL. */
export const GROQ_TOUR_VISIBLE_ON_SITE = "hideFromSite != true";

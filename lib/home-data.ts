import { sanityClient } from "@/lib/sanity.client";
import {
  toursQuery,
  toursWithReviewsQuery,
  customTourQuery,
  faqQuery,
  homePageQuery,
} from "@/lib/sanity.queries";
import { getSiteSettings } from "@/lib/site-settings";
import { isTourVisibleOnSite } from "@/lib/tour-visibility";
import { flattenReviewsFromTours, type TourReviewRaw } from "@/lib/utils/reviews";

/**
 * Единая загрузка данных главной страницы.
 *
 * Все версии главной (см. `lib/versions.ts`) показывают один и тот же контент из Sanity —
 * различается только вёрстка. Поэтому запрос живёт здесь, а не в каждой версии:
 * новая версия не копирует пол-страницы кода и не может «отстать» по данным,
 * если в Sanity появится новое поле.
 */

type SanitySlug = { current: string };

interface SanityPrice {
  value: number;
  currency: string;
}

export interface TourItem {
  _id: string;
  name: string;
  slug: SanitySlug;
  cardImage?: any;
  mainImage: any;
  shortDescription: string;
  dates?: string;
  year?: number | null;
  overlayName?: string | null;
  overlayDate?: string | null;
  price?: SanityPrice;
}

type TourItemFromSanity = TourItem & { hideFromSite?: boolean | null };

export interface HeroContent {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  subheadingAccent?: string;
  photos?: any[];
}

export interface AboutContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photos?: any[];
}

export interface CalendarContent {
  eyebrow?: string;
  heading?: string;
}

export interface ValuesItem {
  title?: string;
  text?: string;
}

export interface ValuesContent {
  eyebrow?: string;
  heading?: string;
  backgroundImage?: any;
  backgroundImageRight?: any;
  items?: ValuesItem[];
}

export interface GuestsContent {
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  items?: string[];
  body?: any;
  photos?: any[];
}

export interface FoundersLink {
  label?: string;
  url?: string;
}

export interface FounderPerson {
  photo?: any;
  name?: string;
  role?: string;
  description?: string;
}

export interface FoundersContent {
  eyebrow?: string;
  heading?: string;
  body?: any;
  photo?: any;
  links?: FoundersLink[];
  founderOne?: FounderPerson;
  founderTwo?: FounderPerson;
}

export interface FaqHeadingContent {
  eyebrow?: string;
  heading?: string;
}

export interface CollabContent {
  eyebrow?: string;
  homeHeading?: string;
  homeHeadingAccent?: string;
  homeDescription?: any;
  images?: any[];
  /** Цветок-декор за текстом блока «Сотрудничество» — своё поле, не общее
   *  со вторым фото блока «О проекте» (см. `home-light.tsx`). */
  decorPhoto?: any;
  tags?: string[];
}

export interface ContactItem {
  label?: string;
  url?: string;
  icon?: string;
}

interface HomePageDoc {
  hero?: HeroContent;
  about?: AboutContent;
  calendar?: CalendarContent;
  values?: ValuesContent;
  guests?: GuestsContent;
  founders?: FoundersContent;
  faq?: FaqHeadingContent;
}

/** Всё, что нужно любой версии главной страницы. */
export interface HomeData {
  homePage: HomePageDoc | null;
  tours: TourItem[];
  reviews: ReturnType<typeof flattenReviewsFromTours>;
  customTour: CollabContent | null;
  faqItems: any;
  primaryContacts: ContactItem[];
}

export async function getHomeData(): Promise<HomeData> {
  const [toursRaw, toursForReviews, customTour, faqItems, homePage, siteSettings] =
    await Promise.all([
      sanityClient.fetch<TourItemFromSanity[]>(toursQuery),
      sanityClient.fetch<{ _id: string; reviews?: TourReviewRaw[] }[]>(toursWithReviewsQuery),
      sanityClient.fetch<CollabContent | null>(customTourQuery),
      sanityClient.fetch(faqQuery),
      sanityClient.fetch<HomePageDoc | null>(homePageQuery),
      /* Через общий кэшируемый источник, а не своим `fetch`: тот же запрос
         параллельно делают футер и плавающая кнопка контактов, и до 25.08 он
         уходил в Sanity трижды за одну загрузку. См. `lib/site-settings.ts`. */
      getSiteSettings(),
    ]);

  const tours: TourItem[] = toursRaw
    .filter((t) => isTourVisibleOnSite(t.hideFromSite))
    .map(({ hideFromSite: _hidden, ...rest }) => rest);

  return {
    homePage,
    tours,
    reviews: flattenReviewsFromTours(toursForReviews),
    customTour,
    faqItems,
    primaryContacts: siteSettings?.primaryContacts ?? [],
  };
}

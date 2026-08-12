import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { sanityClient } from "@/lib/sanity.client";
import { toursQuery, toursWithReviewsQuery, customTourQuery, faqQuery, homePageQuery } from "@/lib/sanity.queries";
import { isTourVisibleOnSite } from "@/lib/tour-visibility";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ValuesSection } from "@/components/sections/values-section";
import { GuestsSection } from "@/components/sections/guests-section";
import { FoundersSection } from "@/components/sections/founders-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { CollabSection } from "@/components/sections/collab-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Reveal } from "@/components/ui/reveal";
import { flattenReviewsFromTours, type TourReviewRaw } from "@/lib/utils/reviews";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Главная — сравнение анимации",
  robots: { index: false, follow: false },
};

/**
 * Сравнительная версия главной с анимацией при скролле (backlog `docs/redesign/backlog.md`
 * п.11 — «две версии, стандартная и анимированная, для сравнения, без копирования кода»).
 *
 * Ни один блок здесь не переписан — это те же серверные секции, что и на `/`
 * (`app/page.tsx`), просто каждая обёрнута в клиентский `<Reveal>`
 * (`components/ui/reveal.tsx`, IntersectionObserver, только уважает
 * `prefers-reduced-motion`). Header/Footer/FloatingContacts сюда отдельно не
 * добавлены — они уже приходят от `app/layout.tsx` (общие для всех роутов),
 * поэтому здесь только сама последовательность секций плюс плашка-баннер сверху,
 * отличающая эту версию от обычной главной.
 *
 * Доступ — как и у `/`: `middleware.ts` редиректит всё, кроме тур-страниц, на
 * `/tours/kas`, значит смотреть эту страницу тоже нужно через `/admin`-обход:
 * `/admin/animated-preview`.
 */
export default async function AnimatedPreviewPage() {
  noStore();

  const [toursRaw, toursForReviews, customTour, faqItems, homePage] = await Promise.all([
    sanityClient.fetch(toursQuery),
    sanityClient.fetch<{ _id: string; reviews?: TourReviewRaw[] }[]>(toursWithReviewsQuery),
    sanityClient.fetch(customTourQuery),
    sanityClient.fetch(faqQuery),
    sanityClient.fetch(homePageQuery),
  ]);

  const tours = (toursRaw as any[])
    .filter((t) => isTourVisibleOnSite(t.hideFromSite))
    .map(({ hideFromSite: _hidden, ...rest }) => rest);

  const reviews = flattenReviewsFromTours(toursForReviews);

  return (
    <div className="animated-preview min-h-screen">
      {/* `top: var(--header-height)` — Header тоже sticky top-0 (задаёт эту переменную сам,
          см. header.tsx), без этого оба sticky-элемента спорили бы за одну и ту же позицию
          при скролле и баннер наезжал бы на шапку. */}
      <div
        className="sticky z-[70] flex items-center justify-between gap-3 bg-foreground px-4 py-2.5 text-[12px] text-background sm:px-6"
        style={{ top: "var(--header-height, 0px)" }}
      >
        <span className="font-medium uppercase tracking-[0.1em]">
          Экспериментальная версия · анимации при скролле
        </span>
        <Link href="/admin" className="shrink-0 underline underline-offset-2 hover:opacity-80">
          ← Обычная версия
        </Link>
      </div>

      <main>
        {homePage?.hero && <HeroSection hero={homePage.hero} />}

        <Reveal>{homePage?.about && <AboutSection about={homePage.about} />}</Reveal>
        <Reveal>
          <CalendarSection calendar={homePage?.calendar} tours={tours} />
        </Reveal>
        <Reveal>
          <ValuesSection values={homePage?.values} />
        </Reveal>
        <Reveal>
          <GuestsSection guests={homePage?.guests} />
        </Reveal>
        <Reveal>
          <FoundersSection founders={homePage?.founders} />
        </Reveal>
        <Reveal>
          <ReviewsSection reviews={reviews} />
        </Reveal>
        <Reveal>
          <CollabSection collab={customTour as any} />
        </Reveal>
        <Reveal>
          <FaqSection items={faqItems as any} faq={(homePage as any)?.faq} />
        </Reveal>
      </main>
    </div>
  );
}

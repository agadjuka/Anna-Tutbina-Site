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
import type { HomeData } from "@/lib/home-data";

/**
 * ВЕРСИЯ 2 — лёгкие анимации.
 *
 * Блоки те же самые, что и в версии 1 — не скопированы, а переиспользованы:
 * каждый обёрнут в клиентский `<Reveal>` (плавное появление при прокрутке,
 * уважает `prefers-reduced-motion`). Микро-интеракции на наведение добавляет
 * CSS-класс `.animated-preview` на обёртке (см. `app/globals.css`) — он
 * действует только внутри этой версии.
 *
 * HERO намеренно без `<Reveal>`: он и так первый экран, появление «снизу вверх»
 * на нём выглядит как подтормаживание при загрузке, а не как анимация.
 */
export function HomeV2({ data }: { data: HomeData }) {
  const { homePage, tours, reviews, customTour, faqItems, primaryContacts } = data;

  return (
    <div className="animated-preview">
      <main className="min-h-screen">
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
          <CollabSection collab={customTour} primaryContacts={primaryContacts} />
        </Reveal>
        <Reveal>
          <FaqSection items={faqItems} faq={homePage?.faq} />
        </Reveal>
      </main>
    </div>
  );
}

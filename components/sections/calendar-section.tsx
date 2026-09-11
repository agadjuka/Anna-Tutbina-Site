import { Container } from "@/components/ui/container";
import { YearTabs } from "@/components/sections/year-tabs";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

interface CalendarContent {
  eyebrow?: string;
  heading?: string;
}

interface Tour {
  _id: string;
  name: string;
  slug: { current: string };
  cardImage?: any;
  mainImage?: any;
  dates?: string;
  year?: number | null;
  overlayName?: string | null;
  overlayDate?: string | null;
}

interface CalendarSectionProps {
  calendar?: CalendarContent | null;
  tours: Tour[];
}

export function CalendarSection({ calendar, tours }: CalendarSectionProps) {
  if (tours.length === 0) return null;

  const headingSlot = (
    <div className="text-center lg:text-left">
      {calendar?.eyebrow && (
        <SectionEyebrow className="text-subtle">
          {calendar.eyebrow}
        </SectionEyebrow>
      )}
      {calendar?.heading && (
        <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-primary sm:text-[33px] lg:mt-[calc(5.14*var(--ona-u))] lg:text-[calc(26.11*var(--ona-u))] lg:leading-[calc(26.72*var(--ona-u))]">
          {calendar.heading}
        </h2>
      )}
    </div>
  );

  return (
    /* Ритм из макета (узел `5:155`, 1921×723): эйбрау y=78, заголовок y=112
       (интерлиньяж 59), таблетки годов y=116 (125×52), карточки y=245.
       Контент шире стандартного контейнера: в макете он идёт от x=339 до 1590,
       то есть 1251px — поэтому `size="wide"` плюс ограничение внутри. */
    <section id="tours" className="relative bg-background py-16 lg:min-h-[calc(264.99*var(--ona-u))] lg:py-[calc(28.58*var(--ona-u))]">
      {/* Нижний предел `clamp` у заголовка опущен с 40px до 30px (и так же
          во всех остальных блоках главной). Формула `3vw` даёт 57.6px на 1920 —
          как в макете, — но на 1280 она хочет 38.4px, а пол в 40px этого не
          давал: заголовок оставался крупным при сузившемся контейнере и
          «БЛИЖАЙШИЕ ПУТЕШЕСТВИЯ» переносилось на две строки на всём диапазоне
          1024–1333px. Это и была причина жалобы «почему всё такое большое»
          (2026-08-21) — на 1920 всё выглядело правильно, ломалось только на
          ноутбучных ширинах. На 1920 правка ничего не меняет: там пол не
          срабатывает. */}
      <Container size="wide">
        <div className="mx-auto w-full lg:max-w-[min(65.1vw,1251px)]">
          <YearTabs tours={tours} headingSlot={headingSlot} />
        </div>
      </Container>
    </section>
  );
}

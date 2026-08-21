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
        <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-primary sm:text-[40px] lg:mt-[min(0.73vw,14px)] lg:text-[clamp(40px,3vw,58px)] lg:leading-[min(3.07vw,59px)]">
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
    <section id="tours" className="relative bg-background py-16 lg:min-h-[min(37.64vw,723px)] lg:py-[min(4.06vw,78px)]">
      <Container size="wide">
        <div className="mx-auto w-full lg:max-w-[min(65.1vw,1251px)]">
          <YearTabs tours={tours} headingSlot={headingSlot} />
        </div>
      </Container>
    </section>
  );
}

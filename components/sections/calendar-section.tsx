import { Container } from "@/components/ui/container";
import { YearTabs } from "@/components/sections/year-tabs";

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
        <p className="text-[15px] font-medium uppercase tracking-[0.18em] text-subtle">
          {calendar.eyebrow}
        </p>
      )}
      {calendar?.heading && (
        <h2 className="mt-3 font-heading text-[32px] uppercase leading-tight text-primary sm:text-[40px] lg:text-[clamp(40px,3vw,58px)]">
          {calendar.heading}
        </h2>
      )}
    </div>
  );

  return (
    <section id="tours" className="relative bg-background py-16 lg:py-24">
      <Container>
        <YearTabs tours={tours} headingSlot={headingSlot} />
      </Container>
    </section>
  );
}

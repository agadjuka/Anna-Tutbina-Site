import { PortableTextContent } from "@/components/ui/portable-text";
import {
  hasPricingSectionContent,
  isLegacyPricingPortableText,
  type PricingDetailsSanity,
} from "@/lib/utils/tour-pricing";

type TourPricingSectionProps = {
  pricingDetails: unknown;
};

function normalizeColumns(raw: PricingDetailsSanity): { title: string; text: string }[] {
  const list = raw.columns ?? [];
  return list
    .slice(0, 3)
    .map((c) => ({
      title: (c?.title ?? "").trim(),
      text: (c?.text ?? "").trim(),
    }))
    .filter((c) => c.title.length > 0 || c.text.length > 0);
}

function SinglePricingCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
      <div className="flex min-h-[3.5rem] items-center justify-center bg-primary px-4 py-3 text-center md:px-5 md:py-4">
        <p className="font-heading text-sm md:text-base font-medium uppercase tracking-[0.12em] text-white text-balance">
          {title || "\u00a0"}
        </p>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5 md:px-5 md:py-6">
        <p className="flex-1 whitespace-pre-wrap text-base md:text-lg leading-relaxed text-muted-foreground">
          {text || "\u00a0"}
        </p>
      </div>
    </div>
  );
}

/** Первая строка grid — только заголовки: высота строки = max(высот); короткий текст по центру по вертикали */
function PricingHeadersThenBodies({
  columns,
  gridClass,
}: {
  columns: { title: string; text: string }[];
  gridClass: string;
}) {
  return (
    <div className={gridClass}>
      {columns.map((col, i) => (
        <div
          key={`h-${i}-${col.title}`}
          className="flex min-h-0 items-center justify-center bg-primary px-4 py-3 text-center md:px-5 md:py-4 rounded-t-2xl border border-border/80 border-b-0"
        >
          <p className="font-heading text-sm md:text-base font-medium uppercase tracking-[0.12em] text-white text-balance">
            {col.title || "\u00a0"}
          </p>
        </div>
      ))}
      {columns.map((col, i) => (
        <div
          key={`b-${i}-${col.title}`}
          className="flex min-h-0 flex-col rounded-b-2xl border border-border/80 border-t-0 bg-card px-4 py-5 shadow-card md:px-5 md:py-6"
        >
          <p className="flex-1 whitespace-pre-wrap text-base md:text-lg leading-relaxed text-muted-foreground">
            {col.text || "\u00a0"}
          </p>
        </div>
      ))}
    </div>
  );
}

export function TourPricingSection({ pricingDetails }: TourPricingSectionProps) {
  if (!hasPricingSectionContent(pricingDetails)) {
    return null;
  }

  if (isLegacyPricingPortableText(pricingDetails)) {
    return (
      <div className="w-full flex justify-center">
        <div className="max-w-4xl w-full prose prose-lg">
          <PortableTextContent
            value={pricingDetails}
            className="text-base md:text-xl leading-relaxed text-muted-foreground text-justify"
          />
        </div>
      </div>
    );
  }

  const p = pricingDetails as PricingDetailsSanity;
  const columns = normalizeColumns(p);
  const mainText = typeof p.mainText === "string" ? p.mainText.trim() : "";
  const n = columns.length;

  /* Вся ширина родителя max-w-4xl — как блок основного текста; grid-cols-* даёт равные колонки */
  const splitGridTwo = "grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-0 md:gap-x-6";
  const splitGridThree = "grid w-full min-w-0 grid-cols-3 gap-x-4 gap-y-0 md:gap-x-6";

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full space-y-8 md:space-y-10">
        {n > 0 && (
          <div className="w-full">
            {n === 1 ? (
              <div className="mx-auto w-full max-w-md">
                <SinglePricingCard title={columns[0].title} text={columns[0].text} />
              </div>
            ) : n === 2 ? (
              <>
                <div className="flex w-full min-w-0 flex-col gap-4 sm:hidden">
                  <SinglePricingCard title={columns[0].title} text={columns[0].text} />
                  <SinglePricingCard title={columns[1].title} text={columns[1].text} />
                </div>
                <div className="hidden sm:block">
                  <PricingHeadersThenBodies columns={columns} gridClass={splitGridTwo} />
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full min-w-0 flex-col gap-4 md:hidden">
                  {columns.map((col, i) => (
                    <SinglePricingCard key={`stack-${i}`} title={col.title} text={col.text} />
                  ))}
                </div>
                <div className="hidden md:block">
                  <PricingHeadersThenBodies columns={columns} gridClass={splitGridThree} />
                </div>
              </>
            )}
          </div>
        )}

        {mainText.length > 0 && (
          <div className="w-full">
            <p className="whitespace-pre-wrap text-base md:text-xl leading-relaxed text-muted-foreground text-justify">
              {mainText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

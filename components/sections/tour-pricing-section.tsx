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

/** Заголовки в одной строке grid — выравниваются по самой высокой ячейке; текст короче центрируется по вертикали */
function PricingHeadersAndBodies({
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
          className="flex min-h-0 items-center justify-center bg-[#bea692] px-4 py-3 text-center md:px-5 md:py-4 rounded-t-2xl border border-border/80 border-b-0"
        >
          <p className="font-heading text-sm md:text-base font-medium uppercase tracking-[0.12em] text-white text-balance">
            {col.title || "\u00a0"}
          </p>
        </div>
      ))}
      {columns.map((col, i) => (
        <div
          key={`b-${i}-${col.title}`}
          className="flex min-h-0 flex-col border border-border/80 border-t-0 bg-card px-4 py-5 shadow-card md:px-5 md:py-6 rounded-b-2xl"
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

  const multiColumnGridClass =
    n === 2
      ? "grid w-full max-w-3xl grid-cols-1 grid-rows-[auto_auto] gap-x-4 gap-y-0 sm:grid-cols-2 sm:grid-rows-[auto_1fr] md:gap-x-6 mx-auto"
      : "grid w-full grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-3 md:gap-x-6";

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full space-y-8 md:space-y-10">
        {n > 0 && (
          <div className="w-full">
            {n === 1 ? (
              <div className="mx-auto w-full max-w-md">
                <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
                  <div className="flex min-h-[3.5rem] items-center justify-center bg-[#bea692] px-4 py-3 text-center md:px-5 md:py-4">
                    <p className="font-heading text-sm md:text-base font-medium uppercase tracking-[0.12em] text-white text-balance">
                      {columns[0].title || "\u00a0"}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col px-4 py-5 md:px-5 md:py-6">
                    <p className="flex-1 whitespace-pre-wrap text-base md:text-lg leading-relaxed text-muted-foreground">
                      {columns[0].text || "\u00a0"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <PricingHeadersAndBodies columns={columns} gridClass={multiColumnGridClass} />
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

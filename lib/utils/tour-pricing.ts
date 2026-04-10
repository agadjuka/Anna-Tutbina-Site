export type PricingColumn = { title?: string | null; text?: string | null };

export type PricingDetailsSanity = {
  columns?: PricingColumn[] | null;
  mainText?: string | null;
};

/** Показывать ли блок «Стоимость»: новый объект, старый portable text или пусто */
export function hasPricingSectionContent(pricing: unknown): boolean {
  if (!pricing) return false;
  if (Array.isArray(pricing)) return pricing.length > 0;
  if (typeof pricing === "object" && pricing !== null) {
    const p = pricing as PricingDetailsSanity;
    const cols = p.columns ?? [];
    if (
      cols.some(
        (c) => (c?.title?.trim() ?? "").length > 0 || (c?.text?.trim() ?? "").length > 0
      )
    ) {
      return true;
    }
    if (typeof p.mainText === "string" && p.mainText.trim().length > 0) return true;
  }
  return false;
}

export function isLegacyPricingPortableText(pricing: unknown): pricing is unknown[] {
  return Array.isArray(pricing) && pricing.length > 0;
}

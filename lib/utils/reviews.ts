export interface ReviewItem {
  _id: string;
  authorName: string;
  profession?: string | null;
  authorImage: any;
  text: string;
}

export interface TourReviewRaw {
  _key: string;
  authorName: string;
  profession?: string | null;
  authorImage: any;
  text: string;
}

/** Отзывы с страницы тура → стабильный _id для ключей React */
export function normalizeTourReviews(
  reviews: TourReviewRaw[] | undefined,
  tourId: string
): ReviewItem[] {
  return (reviews ?? []).map((r) => ({
    _id: `${tourId}-${r._key}`,
    authorName: r.authorName,
    profession: r.profession,
    authorImage: r.authorImage,
    text: r.text,
  }));
}

/** Все отзывы с туров для главной */
export function flattenReviewsFromTours(
  tours: {_id: string; reviews?: TourReviewRaw[]}[]
): ReviewItem[] {
  const out: ReviewItem[] = [];
  for (const t of tours) {
    for (const r of t.reviews ?? []) {
      out.push({
        _id: `${t._id}-${r._key}`,
        authorName: r.authorName,
        profession: r.profession,
        authorImage: r.authorImage,
        text: r.text,
      });
    }
  }
  return out;
}

/**
 * Перемешивает массив отзывов в случайном порядке
 */
export function shuffleReviews<T extends ReviewItem>(reviews: T[]): T[] {
  const shuffled = [...reviews];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


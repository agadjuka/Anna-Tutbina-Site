export interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
}

export interface TourReviewRaw {
  _key: string;
  authorName: string;
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

/**
 * Выбирает случайно 4 отзыва из массива
 */
export function getRandomReviews<T extends ReviewItem>(reviews: T[], count: number = 4): T[] {
  const shuffled = shuffleReviews(reviews);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}


interface ReviewItem {
  _id: string;
  authorName: string;
  authorImage: any;
  text: string;
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


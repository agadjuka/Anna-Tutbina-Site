/**
 * Полное имя тура = МЕСТО + НАЗВАНИЕ.
 *
 * Зачем отдельный хелпер. С 2026-08-21 поле `name` в Sanity хранит только
 * название коллекции — «The Sacred Journey», «Padel Camp», «Untamed Africa»
 * (так подписаны карточки в макете, узел `5:163`). Место («Бали», «Кейптаун»)
 * лежит рядом, в поле `place`. На карточке календаря обе строки видны сразу и
 * склеивать их не надо, а вот везде, где тур упоминается ОДНОЙ строкой —
 * `<title>` страницы тура, OpenGraph, alt картинок — из голого «The Sacred
 * Journey» непонятно, о какой стране речь. Раньше место было вшито в само
 * название («BALI | SACRED JOURNEY»), поэтому вопрос не стоял.
 *
 * Разделитель `·` (а не `|`) намеренно: шаблон заголовков в `app/layout.tsx` —
 * `"%s | ONÁ"`, и вертикальная черта внутри дала бы «Бали | Sacred Journey | ONÁ»,
 * где не видно, что чему подчинено.
 *
 * Если `place` пустой (так у части туров и было до появления поля) — возвращаем
 * одно название, без разделителя и без пустых мест.
 */
export function tourFullTitle(name?: string | null, place?: string | null): string {
  const cleanName = name?.trim() ?? "";
  const cleanPlace = place?.trim() ?? "";

  if (!cleanPlace) return cleanName;
  if (!cleanName) return cleanPlace;
  /* Страховка на случай, если в Studio место снова впишут внутрь названия
     («Bali Retreat» при place «Bali») — тогда не дублируем. Разные алфавиты
     («Бали» ↔ «BALI») этой проверкой, разумеется, не ловятся: от такой пары
     защищает только аккуратность в Studio. */
  if (cleanName.toLowerCase().includes(cleanPlace.toLowerCase())) return cleanName;

  return `${cleanPlace} · ${cleanName}`;
}

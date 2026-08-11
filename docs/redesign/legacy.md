# Старый дизайн: что сохраняем и как вернуть

Требование заказчика: сложные компоненты старого дизайна (карточки туров с анимациями,
блок отзывов) **не удалять** — они делались долго, и к ним нужно уметь быстро вернуться.
Поэтому при замене блока старый компонент остаётся в репозитории, просто перестаёт
использоваться.

**Общее правило:** заменяя блок, новый компонент кладём **рядом** новым файлом,
старый не трогаем и не удаляем. Отключение = убрать импорт из
[`app/page.tsx`](../../app/page.tsx). Возврат = вернуть импорт обратно.

Всё удалённое всё равно лежит в истории git — ветка `feature/homepage-redesign`,
точка отсчёта — коммит `59bf6eb`.

---

## Карточки туров — сохранить обязательно

| Файл | Что делает | Кто использует |
|---|---|---|
| [`tour-card.tsx`](../../components/sections/tour-card.tsx) | сама карточка, анимации, ховеры | только главная |
| [`tour-card-wrapper.tsx`](../../components/sections/tour-card-wrapper.tsx) | обёртка карточки | только главная |
| [`tours-embla.tsx`](../../components/sections/tours-embla.tsx) | мобильная карусель туров | только главная |
| [`fit-one-line-action-label.tsx`](../../components/sections/fit-one-line-action-label.tsx) | подгон подписи кнопки в одну строку | карточки |
| [`want-to-join-button.tsx`](../../components/sections/want-to-join-button.tsx) | кнопка «хочу поехать» | карточки |

Эта группа используется **только на главной** — после блока 3 она станет
неиспользуемой. Файлы оставляем на месте.

## Отзывы — сохранить обязательно

| Файл | Кто использует |
|---|---|
| [`reviews-section.tsx`](../../components/sections/reviews-section.tsx) | главная **и** `/tours/[slug]` |
| [`reviews-embla.tsx`](../../components/sections/reviews-embla.tsx) | reviews-section, tour-reviews-section |
| [`review-card.tsx`](../../components/sections/review-card.tsx) | обе секции отзывов |
| [`expandable-review-text.tsx`](../../components/sections/expandable-review-text.tsx) | review-card |
| [`reviews-collapse-bar.tsx`](../../components/sections/reviews-collapse-bar.tsx) | reviews-section |
| [`reviews-expand-context.tsx`](../../components/sections/reviews-expand-context.tsx) | reviews-section |
| [`reviews-grid-row-align.tsx`](../../components/sections/reviews-grid-row-align.tsx) | reviews-section |

⚠️ **Эта группа живёт и на страницах туров.** Страницы туров в редизайн не входят и
работают в проде — трогать, переименовывать или переносить эти файлы нельзя.
После блока 7 они останутся в работе на `/tours/[slug]`.

## Остальные блоки главной

| Файл | Статус |
|---|---|
| [`custom-tour-section.tsx`](../../components/sections/custom-tour-section.tsx) | заменяется на блоке 8, оставить |
| [`faq-section.tsx`](../../components/sections/faq-section.tsx) | перевёрстывается на блоке 9 — логика аккордеона переиспользуется |
| [`footer.tsx`](../../components/sections/footer.tsx) | перевёрстывается на блоке 10 |

---

## Что уже удалено насовсем

| Файл | Причина |
|---|---|
| `components/sections/about-section.tsx` | раздела «Обо мне» нет в макете, заказчик подтвердил снос |
| `sanity/schemas/about.ts` | то же |

Восстановить при необходимости: `git show 59bf6eb:components/sections/about-section.tsx`

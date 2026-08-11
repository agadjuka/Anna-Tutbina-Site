# Модель контента: Sanity ↔ GROQ ↔ компоненты

Весь текстовый и медийный контент сайта редактируется в Sanity Studio. В коде контента нет.

- Схемы: `sanity/schemas/` (регистрируются в `sanity/schemas/index.ts`)
- Порядок разделов в Studio: `sanity/structure.js`
- Запросы: `lib/sanity.queries.ts` — **единственное место**, где живёт GROQ

## Типы документов

| Тип | Заголовок в Studio | Кол-во | Схема |
|---|---|---|---|
| `tour` | Туры | много, сортируемые (`orderRank`) | `sanity/schemas/tour.ts` |
| `about` | Обо мне | синглтон (берётся `[0]`) | `sanity/schemas/about.ts` |
| `customTour` | Индивидуальный тур | синглтон | `sanity/schemas/customTour.ts` |
| `faq` | FAQ | много, сортируемые | `sanity/schemas/faq.ts` |
| `reviewItem` | Отзыв | не документ, а объект внутри `tour.reviews` | `sanity/schemas/reviewItem.ts` |

Сортировка туров и FAQ — плагином `@sanity/orderable-document-list` (drag & drop в Studio,
поле `orderRank`, в запросах `|order(orderRank)`).

**Отзывы не являются отдельными документами.** Они лежат внутри туров. Блок отзывов на главной
собирает их со всех туров и перемешивает. Стабильный React-ключ строится как `${tourId}-${_key}`
в `lib/utils/reviews.ts`.

## Поля тура и где они выводятся

| Поле | Тип | Где на сайте |
|---|---|---|
| `name` | string, обяз. | Заголовок, title страницы, карточка |
| `slug` | slug, обяз. | URL `/tours/<slug>` |
| `cardImage` | image | Фото в карточке на главной; если пусто — берётся `mainImage` |
| `mainImage` | image, обяз. | Большое фото вверху страницы тура |
| `overlayName` / `overlayDate` | portable text | Надписи поверх главного фото (30 % и 66 % высоты) |
| `introText` | portable text | Секция «О туре» |
| `programByDays[]` | массив объектов: `dayTitle`, `dayImage[]`, `dayDescription` | «Что нас ждёт» |
| `accommodation[]` | массив: `locationName`, `locationImages[]`, `locationDescription` | «Размещение» |
| `pricingDetails` | объект: `columns[]` (до 3: `title`, `text`) + `mainText` | «Стоимость» |
| `included` / `notIncluded` | portable text | «Условия» |
| `recommendedFlights` | объект: `image`, `text` | «Рейсы» |
| `organizers[]` | массив: `name`, `photo`, `bio` | «Организаторы» |
| `reviews[]` | массив `reviewItem` | Отзывы тура + общий блок на главной |
| `atmosphereGallery[]` | массив image | «Атмосфера наших туров» + лайтбокс |
| `price` | объект: `value`, `currency` | Шапка страницы тура, карточка |
| `dates` | string, свободный формат («10–20 мая») | Шапка, карточка |
| `shortDescription` | text | Карточка на главной, meta description |
| `hideFromSite` | boolean | Скрывает тур из списков и по прямой ссылке |

Секции страницы тура рендерятся условно: пустое поле — секции нет, и в якорном меню
(`TourNavigation`) пункт тоже пропадает.

### `pricingDetails`: два формата

Поле пережило миграцию. `lib/utils/tour-pricing.ts` понимает оба:

- **актуальный** — объект `{ columns[], mainText }`;
- **legacy** — массив Portable Text (в старых документах).

Проверять наличие контента только через `hasPricingSectionContent()`, не через `!!pricing`:
пустой объект тоже «truthy», и секция отрисуется пустой.

## Запросы

| Запрос | Используется в | Что отдаёт |
|---|---|---|
| `toursQuery` | `app/page.tsx` | Видимые туры для списка на главной |
| `tourBySlugQuery` | `app/tours/[slug]/page.tsx` | Полный тур по slug |
| `tourMetadataQuery` | `generateMetadata` того же роута | Только `name` + `shortDescription` |
| `toursWithReviewsQuery` | `app/page.tsx` | Отзывы **со всех** туров, включая скрытые |
| `aboutQuery` | `app/page.tsx` | `images[0]` + `bio` |
| `customTourQuery` | главная и `/custom-tour` | Синглтон индивидуального тура |
| `faqQuery` | `app/page.tsx` | Список FAQ по порядку |
| `toursSlugsQuery` | `app/sitemap.ts` | Slug + `_updatedAt` видимых туров |

Все запросы с картинками разворачивают ассет:

```groq
image{ ..., asset->{ _id, metadata{dimensions{width,height,aspectRatio}} } }
```

Без этого `SanityImage` не получит пропорции — не копируйте запросы, теряя этот блок.

Фильтр видимости подставляется как `(${GROQ_TOUR_VISIBLE_ON_SITE})` из `lib/tour-visibility.ts`.
Условие руками не писать.

## Как добавить поле контента

1. **Схема** — `defineField` в нужном файле `sanity/schemas/`. Заголовок и `description` —
   по-русски, их читает заказчик в Studio.
2. **Запрос** — добавить поле в соответствующий запрос в `lib/sanity.queries.ts`
   (для картинки — вместе с блоком `asset->{...}`).
3. **Рендер** — вывести в компоненте, обязательно с проверкой на пустоту: старые документы
   поля не имеют.
4. Если поле управляет отдельной секцией страницы тура — добавить её в массив `sections`
   у `TourNavigation` с корректным `available`.
5. Studio перезапустить (`npm run sanity:dev`), фронт подхватит изменения сам.

Типичная ошибка: поле добавили в схему и в вёрстку, но забыли в GROQ — на сайте всегда `undefined`,
и никакой ошибки при этом нет.

## Синглтоны

`about` и `customTour` фактически существуют в одном экземпляре, но ограничения на уровне Studio
нет — запросы просто берут `[0]`. Если в датасете окажется два документа `about`, сайт покажет
случайный из них.

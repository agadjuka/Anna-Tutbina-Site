# Архитектура

## Общая схема

```
Sanity Cloud (projectId i8t1squc, dataset production)
        │  GROQ через next-sanity, useCdn: false
        ▼
lib/sanity.queries.ts ──► серверные компоненты в app/ ──► секции в components/sections/
                                                              │
                                          "use client" только там, где нужен DOM/состояние
```

Бэкенда своего нет: Next.js читает контент напрямую из Sanity на сервере при каждом запросе.
API-роутов нет, форм с отправкой данных нет — заявки идут через внешние ссылки
(Telegram / WhatsApp / телефон).

## Роуты

| Роут | Файл | Рендеринг | Данные |
|---|---|---|---|
| `/` | `app/page.tsx` | `force-dynamic` + `noStore()` | `toursQuery`, `aboutQuery`, `toursWithReviewsQuery`, `customTourQuery`, `faqQuery` (параллельно, `Promise.all`) |
| `/tours/[slug]` | `app/tours/[slug]/page.tsx` | `force-dynamic`, `revalidate = 0` | `tourBySlugQuery`; метаданные — `tourMetadataQuery` |
| `/custom-tour` | `app/custom-tour/page.tsx` | статический | `customTourQuery` |
| `/robots.txt` | `app/robots.ts` | статический | — |
| `/sitemap.xml` | `app/sitemap.ts` | статический | `toursSlugsQuery` |

Кэш выключен намеренно: правки в Studio должны появляться на сайте сразу, без пересборки.
Плата за это — запрос в Sanity на каждый заход. Если понадобится скорость, правильный шаг —
не `revalidate`, а вебхук Sanity → `revalidateTag`.

`app/layout.tsx` задаёт `<html lang="ru">`, подключает CSS-переменные четырёх локальных шрифтов,
глобальные meta/OpenGraph и оборачивает страницы в `Header` / `FloatingContacts` / `Footer`.

## middleware.ts — временные ограничения

Действует на всё, кроме `api`, `_next/static`, `_next/image` и путей с точкой (файлы,
`robots.txt`, `sitemap.xml`).

1. Путь начинается с `/admin` → `rewrite` на путь без префикса. Это «служебный вход»: полный
   сайт со всей навигацией без снятия ограничений для посетителей.
2. Иначе путь должен быть в `allowedPaths` (сейчас шесть страниц туров), любой другой —
   `redirect` на `/tours/kas`.

Следствия, о которых надо помнить:

- **`/` и `/custom-tour` посетителю недоступны**, хотя перечислены в `sitemap.xml`
  и указаны как canonical.
- Несуществующий тур даёт редирект, а не 404.
- `/admin` не защищён паролем — это обфускация, а не авторизация.

Как снимать ограничения — [remove-restrictions.md](remove-restrictions.md).
Открытые вопросы по этому блоку — в [known-issues.md](known-issues.md).

## Видимость туров

Флаг `hideFromSite` в Sanity выключает тур **и в списках, и по прямой ссылке**.
Правило описано один раз в `lib/tour-visibility.ts` в двух формах:

- `GROQ_TOUR_VISIBLE_ON_SITE` — подставляется в запросы;
- `isTourVisibleOnSite()` — для дофильтрации в TS.

Отзывы скрытых туров при этом **продолжают** показываться в общем блоке на главной —
`toursWithReviewsQuery` намеренно не фильтрует по этому флагу.

## Карта компонентов

### Секции (`components/sections/`)

**Главная**
- `about-section` — блок «Обо мне» (фото + biography из Sanity).
- `tours-embla` (client) — мобильная карусель туров; `tour-card-wrapper` (client) масштабирует
  шрифт карточки по её ширине через `ResizeObserver`; `tour-card` — сама карточка.
- `reviews-section` — оркестратор отзывов: перемешивает их (`shuffleReviews`) и выбирает раскладку
  (карусель при >4, сетка иначе). Вложенные:
  `reviews-embla` (client), `review-card`, `expandable-review-text` (client, «читать целиком»),
  `reviews-expand-context` (client, общий стейт «раскрыть все»), `reviews-collapse-bar` (client),
  `reviews-grid-row-align` (client, выравнивание высот карточек в ряду),
  `fit-one-line-action-label` (client, подгонка подписи кнопки под одну строку),
  `review-action-button-styles` — общие классы кнопок отзывов.
- `custom-tour-section` — тизер индивидуального тура.
- `faq-section` (client) — аккордеон.

**Страница тура**
- `tour-navigation` (client) — якорное меню по доступным секциям.
- `program-days-carousel` (client) — «Что нас ждёт», дни программы.
- `accommodation-carousel` (client) — «Размещение». ~85 % кода общего с предыдущим.
- `tour-pricing-section` — «Стоимость»; поддерживает и новый объект (колонки + текст),
  и legacy-Portable-Text (см. `lib/utils/tour-pricing.ts`).
- `included-not-included-section` (client) — «Условия».
- `recommended-flights-section` — скриншот рейсов + пояснения.
- `tour-reviews-section`, `organizers-section`.
- `tour-gallery` (client) — «Атмосфера» + лайтбокс (`yet-another-react-lightbox`).
- `want-to-join-button` (client) — CTA, раскрывающая контакты.

**Общие**
- `header` (client) — sticky-шапка, логотип, навигация (скрыта флагом), пишет реальную высоту
  в CSS-переменную `--header-height` (её использует `scroll-margin-top` в `globals.css`).
- `footer`, `floating-contacts` (client) — плавающая кнопка связи.

### Примитивы (`components/ui/`)

`Container` (макс. ширина + паддинги), `Button`, `Heading`, `SectionHeading` (заголовок с линиями),
`Paragraph`, `SanityImage` (обёртка `next/image` + `urlFor`, ретина ×2, плейсхолдеры),
`PortableTextContent` (рендер Portable Text с фирменным `<strong>`), `DecorativeElements`.

## Обработка изображений

`SanityImage` строит URL через `urlFor()`: запрашивает удвоенный размер (ретина),
`auto("format")`, `quality(90)`. Домен `cdn.sanity.io` разрешён в `next.config.ts`
через `images.remotePatterns`. Все GROQ-запросы подтягивают `asset->metadata.dimensions`,
чтобы знать пропорции без лишнего запроса.

## Шрифты

Четыре локальных шрифта (`next/font/local`) отдают CSS-переменные на `<html>`:
`--font-heading`, `--font-body`, `--font-logo`, `--font-logo-subtitle`.
`lib/fonts.ts` **генерируется** скриптом `scripts/update-fonts.ts` (хук `prebuild`),
источник — файлы в `public/fonts/`. Подробности — [design-system.md](design-system.md).

## SEO

- Шаблон title `%s | ONÁ`, `metadataBase` на прод-домен, OpenGraph/Twitter — в `app/layout.tsx`.
- У тура — `generateMetadata` с названием, `shortDescription`, canonical и OG.
  Ненайденный тур получает `robots: { index: false }`.
- `sitemap.xml` собирается из видимых туров с реальным `_updatedAt`.
- `robots.txt` разрешает всё.

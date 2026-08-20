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
| `/` | `app/page.tsx` | `force-dynamic` + `noStore()` | `getHomeData()` — один общий загрузчик (`lib/home-data.ts`), внутри `Promise.all` по `toursQuery`, `toursWithReviewsQuery`, `customTourQuery`, `faqQuery`, `homePageQuery`, `siteSettingsQuery`. Вёрстка вынесена в `HomeV1` (см. ниже) |
| `/versions` | `app/versions/page.tsx` | статический | — (список берётся из `lib/versions.ts`) |
| `/versions/[id]` | `app/versions/[id]/page.tsx` | `force-dynamic` + `noStore()` | тот же `getHomeData()` |
| `/tours/[slug]` | `app/tours/[slug]/page.tsx` | `force-dynamic`, `revalidate = 0` | `tourBySlugQuery`; метаданные — `tourMetadataQuery` |
| `/custom-tour` | `app/custom-tour/page.tsx` | статический | `customTourQuery` — **публично недоступен**, middleware редиректит на `/#collab` |
| `/robots.txt` | `app/robots.ts` | статический | — |
| `/sitemap.xml` | `app/sitemap.ts` | статический | `toursSlugsQuery` |

Главная и все её варианты используют **один загрузчик данных и одни и те же секции** —
`app/page.tsx` рендерит `HomeV1`, тот же компонент показывается как «Версия 1» на `/versions`.
Как устроены версии и как добавить новую — [VERSIONS.md](VERSIONS.md).

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
2. `/custom-tour` → `redirect` на `/#collab`.
3. `/versions` и `/versions/*` → пропускаются **без ограничений и без префикса `/admin`**:
   ссылку на сравнение версий заказчик отправляет своему клиенту. У этих страниц стоит
   `robots: noindex`.
4. Иначе путь должен быть в `allowedPaths` (сейчас шесть страниц туров), любой другой —
   `redirect` на `/tours/kas`.

Следствия, о которых надо помнить:

- **`/` и `/custom-tour` посетителю недоступны**, хотя `/` перечислена в `sitemap.xml`
  и указана как canonical.
- Несуществующий тур даёт редирект, а не 404.
- `/admin` не защищён паролем — это обфускация, а не авторизация.
- `/tours/kas` — цель редиректа по умолчанию, то есть **точка входа для всего сайта**.
  Если этот тур скрыт или снят с публикации в Sanity, случайный посетитель домена
  получает 404 (такое уже случалось — см. [known-issues.md](known-issues.md)).

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
  в CSS-переменную `--header-height` (её использует `scroll-margin-top` в `globals.css`
  и подтяжка полноэкранного HERO). Показ/скрытие поверх полноэкранного HERO решает CSS
  (`body:has([data-hero-fullscreen])` + `data-shown`), не React — подробности
  в [design-system.md](design-system.md).
- `footer`, `floating-contacts` (client) — плавающая кнопка связи. Контакты приходят
  из Sanity (`siteSettingsQuery` → `primaryContacts`), в коде не захардкожены.

### Версии главной (`components/versions/`)

`home-v1`…`home-v6` — раскладки главной, переиспользующие те же секции; `registry.tsx`
связывает id с компонентом, `version-badge` — плашка возврата к списку, `force-motion` —
принудительное включение анимаций на `/versions/*`. См. [VERSIONS.md](VERSIONS.md).

### Примитивы (`components/ui/`)

`Container` (макс. ширина + паддинги), `Button`, `Heading`, `SectionHeading` (заголовок с линиями),
`Paragraph`, `SanityImage` (обёртка `next/image` + `urlFor`, ретина ×2, плейсхолдеры),
`PortableTextContent` (рендер Portable Text с фирменным `<strong>`), `DecorativeElements`.

## Обработка изображений

`SanityImage` строит URL через `urlFor()`: запрашивает удвоенный размер (ретина),
`auto("format")`, `quality(90)`. Домен `cdn.sanity.io` разрешён в `next.config.ts`
через `images.remotePatterns`. Все GROQ-запросы подтягивают `asset->metadata.dimensions`,
чтобы знать пропорции без лишнего запроса.

⚠️ **В режиме `fill` обязательно передавать `sizes`.** Без него `next/image` считает, что
картинка занимает всю ширину окна, и браузер тянет самый крупный вариант из srcset (до 3840px)
— при том что исходник из Sanity и так обрезан до 1200px, то есть это чистый апскейл. Каждый
такой кадр надо скачать и раскодировать в главном потоке: на этом заметно «залипала» прокрутка
в момент, когда секция въезжает в кадр. Значение — реальная ширина картинки на экране,
например `sizes="(max-width: 1023px) 100vw, 45vw"`.

Пропс `aspectRatio` просит Sanity отдать фото под форму контейнера. Если его не передать,
Sanity кропает по фиксированному портретному 1200×1600, а браузер поверх режет ещё раз под
реальную рамку — двойная обрезка, от которой уже дважды «срезало лица» (CALENDAR, VALUES).

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

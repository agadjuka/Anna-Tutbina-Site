# Дизайн-система

Tailwind CSS v4 без `tailwind.config`: вся тема объявлена блоком `@theme` в
[`app/globals.css`](../app/globals.css). Исходные требования заказчика — [brand-guidelines.md](brand-guidelines.md).

## Палитра

| Токен | HEX | Назначение |
|---|---|---|
| `background` | `#EEEAE4` | Основной фон всех страниц |
| `foreground` | `#1E1E1C` | Основной текст |
| `primary` | `#69695C` | Фирменный зелёно-серый: заголовки, шапка, иконки, линии, кнопки |
| `primary-light` | `#7D7D6F` | Градиенты, hover |
| `primary-dark` | `#5A5A4E` | Градиенты, hover |
| `muted` | `#DED9D0` | Подложки иконок и второстепенных блоков |
| `muted-foreground` | `#5C5C58` | Второстепенный текст |
| `card` | `#FFFFFF` | Фон карточек |
| `border` | `#D4CFC4` | Разделители |
| `border-light` | `#EBE6DF` | Слабые разделители |

Использовать **только токены**: `bg-primary`, `text-foreground`, `border-border`, `bg-primary/5`.
Хардкод hex в классах запрещён — предыдущая палитра выпиливалась одноразовым скриптом
`scripts/replace-colors.mjs`, повторять этот опыт не нужно.

Исключение, уже присутствующее в коде: фирменный зелёный WhatsApp `#25D366` в hover-состояниях иконок.

## Шрифты

| Переменная | Шрифт | Где применяется |
|---|---|---|
| `--font-heading` | Cormorant Regular | Все `h1`–`h6` (задано глобально в `globals.css`) |
| `--font-body` | Kinetika | `body`, основной текст, `<strong>` |
| `--font-logo` | La Luxes | Логотип «ONÁ» в шапке и футере |
| `--font-logo-subtitle` | MADE TheArtist Script | Подпись «woman space & travel» |

Утилиты: `.font-heading`, `.font-sans`, `.font-logo`, `.font-logo-subtitle`.

### Как менять шрифт

1. Положить файл (`.ttf/.otf/.woff/.woff2`) в `public/fonts/headings|body|logo/`.
2. `npm run update-fonts` — перегенерирует `lib/fonts.ts`.
3. Проверить результат в `lib/fonts.ts` и на странице.

Правила генератора (`scripts/update-fonts.ts`), о них легко споткнуться:

- в `headings/` приоритет у файла со словом *cormorant* в имени, иначе берётся первый попавшийся;
- в `logo/` файл со словом *script* или *theartist* уходит в `--font-logo-subtitle`, остальные — в `--font-logo`;
- начертание определяется по имени файла (`regular` → 400, `bold` → 700 и т. д.);
- **`lib/fonts.ts` править руками бессмысленно** — `prebuild` перезапишет файл при каждой сборке.

## Типографика

- Заголовки автоматически получают `font-heading` + `text-primary` из базового слоя.
- `SectionHeading` — фирменный заголовок секции: горизонтальные линии по бокам, uppercase,
  увеличенный трекинг. Это стандарт для всех секций, не собирайте свой.
- `Heading` (`as="h1..h4"`) — крупный заголовок страницы.
- `Paragraph` — основной абзац, `text-base md:text-xl`.
- `PortableTextContent` — рендер контента из Sanity; следит, чтобы `<strong>` оставался
  шрифтом body и не «прыгал» в размере.
- На мобильных для заголовков включены `word-break: break-word` и `overflow-wrap: anywhere`.

## Утилиты в globals.css

`.shadow-card`, `.shadow-card-hover`, `.shadow-card-elevated` — фирменные тени на базе `primary`.
`.text-gradient`, `.text-gradient-accent`, `.gradient-overlay`, `.decorative-bg` — градиенты.
`.asymmetric-clip`, `.rotate-3d` — декоративные формы. `.scrollbar-hide`, `.truncate-long`,
`.text-balance`, `.text-justify-smooth` — вспомогательные.

## Раскладка и скролл

- `Container` (`max-w-screen-xl`, `px-4 md:px-8`) — единственная обёртка ширины, свою не заводить.
- Контентные блоки внутри контейнера часто ограничены `max-w-4xl` и центрированы.
- Брейкпоинты — стандартные Tailwind, основной переключатель мобильный/десктоп — `md` (768px).
- `Header` пишет свою фактическую высоту в `--header-height`; правило `[id] { scroll-margin-top }`
  использует её, чтобы якорные переходы не заезжали под шапку. Если меняете шапку — не сломайте
  `ResizeObserver` в `header.tsx`.
- Глобально `overflow-x: hidden` на `html/body/main` — горизонтального скролла быть не должно.

## Мотивы интерфейса

- Скругления: `rounded-2xl` у карточек и фото, `rounded-full` у кнопок и иконок.
- Все интерактивные элементы имеют `focus-visible:ring-2 ring-primary` — при добавлении новых
  кнопок фокус-состояние обязательно.
- Переходы 200–500 мс; в базовом слое всем элементам назначен `transition-colors duration-200`.
- Контакты (Telegram, WhatsApp, телефон) появляются в трёх местах: `footer`,
  `floating-contacts`, `want-to-join-button`. Значения продублированы в коде —
  при смене номера править все три (см. [known-issues.md](known-issues.md)).

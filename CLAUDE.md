# CLAUDE.md — контекст проекта для агентов

Сайт авторских женских туров **ONÁ** (Анна Турбина). Next.js 16 App Router + Sanity CMS.
Прод: https://www.ona-womantravel.com · Репозиторий: `agadjuka/Anna-Tutbina-Site` (ветка `master`).

Этот файл — точка входа. Подробности в [`docs/`](docs/README.md).

---

## ⚠️ Прочитать до первой правки

1. **Сайт сейчас в режиме временных ограничений.** [`middleware.ts`](middleware.ts) редиректит
   всё, кроме белого списка туров, на `/tours/kas`. **Это сделано намеренно — не «чинить».**
   Как снять — [`docs/remove-restrictions.md`](docs/remove-restrictions.md).
   Навигация в шапке при этом **показана** (`HIDE_NAVIGATION = false` с 2026-08-20, по правкам
   заказчика): её ссылки ведут на закрытую главную и редиректят обратно на `/tours/kas` — так и
   задумано, см. [`docs/redesign/client-feedback-2026-08.md`](docs/redesign/client-feedback-2026-08.md).
2. **Главная страница `/` недоступна публично** из-за п.1. Проверять её надо через
   `http://localhost:3000/admin/` (префикс `/admin` — обходной rewrite в middleware).
3. **`lib/fonts.ts` — генерируемый файл.** Правки руками затираются на `prebuild`.
   Менять шрифты = класть файлы в `public/fonts/{headings,body,logo}/` и запускать `npm run update-fonts`.
4. **Весь контент живёт в Sanity, не в коде.** Тексты, фото, цены, программы туров, отзывы, FAQ
   правятся в Studio. В коде — только вёрстка и запросы. См. [`docs/content-model.md`](docs/content-model.md).
5. **Никогда не коммитить** `.env*` (кроме `.env.example`), `Фото/`, `Шрифты/`, `.next/`, `sanity/dist/`.

---

## Команды

```bash
npm run dev              # Next.js dev-сервер → http://localhost:3000
npm run build            # прод-сборка (сначала автоматически прогоняет update-fonts)
npm run lint             # ESLint
npx tsc --noEmit         # проверка типов фронтенда
npx tsc --noEmit -p sanity/tsconfig.json   # проверка типов схем Studio
npm run update-fonts     # перегенерировать lib/fonts.ts из public/fonts/
npm run sanity:dev       # Sanity Studio → http://localhost:3333 (нужен npm i в sanity/)
npm run sanity:deploy    # деплой Studio
```

Studio — **отдельный npm-пакет** в `sanity/` со своими зависимостями (`sanity/node_modules`,
ставятся через `npm --prefix sanity install`). Типы схем не проверяются вместе с фронтендом —
у Studio свой `sanity/tsconfig.json`, прогоняйте его отдельной командой выше.

Окружение: Windows, PowerShell, Node 20, npm 10, `legacy-peer-deps=true` в `.npmrc`.
Путь проекта содержит кириллицу и пробелы — в шелле кавычить пути.

---

## Карта репозитория

```
app/                     # роуты App Router
  layout.tsx             # <html>, шрифты, Header/Footer/FloatingContacts, глобальные meta
  page.tsx               # главная: about → туры → отзывы → индивидуальный тур → FAQ
  tours/[slug]/page.tsx  # страница тура (самый большой роут, ~340 строк)
  custom-tour/page.tsx   # «Индивидуальный тур»
  robots.ts, sitemap.ts  # SEO-роуты
  globals.css            # Tailwind v4 @theme — токены цветов, базовые стили, утилиты
components/sections/     # крупные секции страниц (см. docs/architecture.md)
components/ui/           # примитивы: Container, Button, Heading, SanityImage, PortableTextContent…
lib/
  sanity.client.ts       # клиент Sanity + urlFor()
  sanity.queries.ts      # ВСЕ GROQ-запросы (единственное место)
  tour-visibility.ts     # флаг hideFromSite: и TS-, и GROQ-версия правила
  utils/                 # reviews.ts, tour-pricing.ts
sanity/                  # Studio: схемы, структура, конфиг
scripts/update-fonts.ts  # генератор lib/fonts.ts
middleware.ts            # временные ограничения доступа + /admin-обход
docs/                    # документация проекта
```

---

## Конвенции

- **Язык:** UI-тексты, комментарии и коммиты — по-русски. Имена файлов — `kebab-case`, компоненты — `PascalCase`.
- **Компоненты по умолчанию серверные.** `"use client"` — только там, где реально нужны хуки/DOM
  (карусели Embla, лайтбокс, аккордеоны, ResizeObserver).
- **Импорты через алиас `@/`** (`@/components/...`, `@/lib/...`).
- **Классы объединять через `cn()`** из `@/lib/utils`.
- **Цвета — только токены** (`bg-primary`, `text-foreground`, `border-border`), не хардкод hex.
  Палитра и шрифты — [`docs/design-system.md`](docs/design-system.md).
- **Новый GROQ-запрос — в `lib/sanity.queries.ts`**, не инлайном в компоненте.
- **Новое поле контента = 3 правки:** схема в `sanity/schemas/` → запрос в `lib/sanity.queries.ts`
  → рендер в компоненте. Пропуск любого шага = поле «молча» не появится на сайте.
- Данные туров фильтруются по `hideFromSite` **и в GROQ, и в TS** — использовать хелперы
  из `lib/tour-visibility.ts`, не дублировать условие.
- **Размеры на главной — по закону масштабирования, а не фиксированные px.** Любое значение
  lg-ветки (кегль, отступ, зазор, размер элемента) пишется как `min(X/1920*100vw, Xpx)`, где
  `X` — величина из макета при 1920. Для текста, который иначе ушёл бы ниже 12px, —
  `clamp(12px, …vw, Xpx)`. **Фиксированный `lg:text-[17px]` или `lg:px-[26px]` — ошибка:**
  на 1920 всё совпадёт с макетом, а на ноутбуке контейнер сузится, текст останется прежним
  и полезет в две строки. Подробности и исключения — [`docs/design-system.md`](docs/design-system.md).
- **Новую утилиту объявлять через `@utility`, не через `@layer utilities`** (см. грабли ниже).

---

## Документация

| Файл | О чём |
|---|---|
| [`docs/redesign/README.md`](docs/redesign/README.md) | **Редизайн главной по макету Figma — активная задача.** Правила, процесс, реестр блоков |
| [`docs/redesign/client-feedback-2026-08.md`](docs/redesign/client-feedback-2026-08.md) | **Правки заказчика (авг. 2026): разбор каждого замечания, план, открытые вопросы** |
| [`docs/redesign/figma-parity-checklist.md`](docs/redesign/figma-parity-checklist.md) | **Как приводить блок в соответствие с Figma по координатам узлов.** Метод, статус по блокам, грабли — читать до любой правки вёрстки главной |
| [`docs/redesign/lightweight-scale-plan.md`](docs/redesign/lightweight-scale-plan.md) | **Облегчение главной (v7–v9) — последняя задача, авг. 2026.** Замеры, механизм CSS-масштаба, грабли, открытые вопросы |
| [`docs/VERSIONS.md`](docs/VERSIONS.md) | Версии главной: как устроен хаб `/versions`. Боевая главная = версия 6; **v7–v9 — облегчённые варианты на оценке** |
| [`docs/versions-cleanup-plan.md`](docs/versions-cleanup-plan.md) | Как убрать систему версий и отклонённые v1–v5, когда решим. Сейчас они просто скрыты |
| [`docs/architecture.md`](docs/architecture.md) | Роутинг, рендеринг, поток данных, middleware, SEO, карта компонентов |
| [`docs/content-model.md`](docs/content-model.md) | Схемы Sanity ↔ GROQ ↔ компоненты, как добавить поле |
| [`docs/design-system.md`](docs/design-system.md) | Цвета, шрифты, типографика, UI-примитивы |
| [`docs/development.md`](docs/development.md) | Установка, env, Studio, деплой, траблшутинг |
| [`docs/known-issues.md`](docs/known-issues.md) | Технический долг и план исправлений — **смотреть перед рефакторингом** |
| [`docs/remove-restrictions.md`](docs/remove-restrictions.md) | Как снять временные ограничения доступа |
| [`docs/brand-guidelines.md`](docs/brand-guidelines.md) | Исходный бриф по фирменному стилю от заказчика |

---

## Известные грабли

- `npm run build` печатает предупреждение о депрекации `middleware` → `proxy` (Next 16). Пока не мигрировали.
- В коде ~47 `any` вокруг Sanity-данных: типов у контента нет, ошибки в полях всплывают только в рантайме.
- ESLint падает с ошибками на существующем коде (`no-explicit-any`, `react-hooks/set-state-in-effect`) —
  **это накопленный долг, а не следствие ваших правок.** Сверяйтесь с `docs/known-issues.md`.
- Тестов в проекте нет. Проверка изменений = `npx tsc --noEmit` + `npm run build` + визуальный прогон
  через `/admin/`.
- **`overflow-x` на `html/body/main` — только `clip`, не `hidden`.** `hidden` делает `<body>`
  и `<main>` скролл-контейнерами (спека: `overflow-y` становится `auto`) — от этого ломался
  полноэкранный HERO, «залипала» прокрутка на мобильном и переставал работать `sticky` у шапки.
  Подробности — `docs/design-system.md`.
- **Анимации в версиях главной: `animation-fill-mode: backwards`, никогда `both`.** Доигравшая
  анимация с `forwards` навсегда забирает себе свойство и ломает `:hover` (элемент прыгает
  обратно в конце перехода). Элементы со своим hover-эффектом или статичной прозрачностью
  исключаются атрибутами `data-no-lift` / `data-static-photo`. Подробности — `docs/VERSIONS.md`.
- **Рукописный класс в `@layer utilities` не получает вариантов Tailwind.** В v4 такой класс —
  просто CSS-правило, сборщик не считает его утилитой, и `lg:font-heading`, `[&_em]:font-heading`,
  `hover:shadow-card-hover` **не выдают никакого правила** и молча не работают: класс в разметке
  есть, стиля нет. Объявлять через `@utility имя { … }`. Исключение — `font-sans`: это имя занято
  темой Tailwind, и через `@utility` пользовательское правило проигрывает теме (текст отзывов
  уехал на системный `ui-sans-serif`), поэтому оно намеренно осталось в `@layer utilities`.
- В режиме `fill` у `SanityImage` **обязателен `sizes`** — иначе браузер тянет 3840px-вариант
  вместо нужных 300–700 и прокрутка спотыкается о декодирование. См. `docs/architecture.md`.
- **`space-y-*` — это `margin-block-end` на `:not(:last-child)`, а не `margin-top`.** Перекрыть
  такой зазор правилом `* + * { margin-top: … }` **невозможно**: смежные вертикальные margin
  схлопываются в максимум, а не складываются, и меньшее из двух значений молча проигрывает —
  класс есть, правило есть, эффекта нет. Перекрывать нужно **то же свойство того же элемента**,
  что и оригинал. На этом попались в пяти местах сразу (ABOUT, GUESTS, FOUNDERS, COLLAB, FAQ),
  см. `docs/redesign/lightweight-scale-plan.md`. Там же: `row-gap` не действует на обычном блоке
  (не flex/grid), а `opacity-0` продолжает резервировать место в потоке.
- **⚠️ Turbopack иногда теряет CSS-правила при горячей пересборке.** Правило есть в
  `globals.css`, а в отданном браузеру `_next/static/chunks/*.css` его нет; `touch` не помогает,
  помогает содержательная правка файла или рестарт `npm run dev`. **Не верьте, что правка
  применилась, — проверяйте скачиванием скомпилированного CSS** (`curl … | grep 'ваш-селектор'`),
  иначе будете чинить верный код. Ловили многократно за одну сессию.

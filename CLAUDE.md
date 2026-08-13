# CLAUDE.md — контекст проекта для агентов

Сайт авторских женских туров **ONÁ** (Анна Турбина). Next.js 16 App Router + Sanity CMS.
Прод: https://www.ona-womantravel.com · Репозиторий: `agadjuka/Anna-Tutbina-Site` (ветка `master`).

Этот файл — точка входа. Подробности в [`docs/`](docs/README.md).

---

## ⚠️ Прочитать до первой правки

1. **Сайт сейчас в режиме временных ограничений.** [`middleware.ts`](middleware.ts) редиректит
   всё, кроме белого списка туров, на `/tours/kas`; [`components/sections/header.tsx`](components/sections/header.tsx)
   скрывает навигацию флагом `HIDE_NAVIGATION = true`. **Это сделано намеренно — не «чинить».**
   Как снять — [`docs/remove-restrictions.md`](docs/remove-restrictions.md).
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

---

## Документация

| Файл | О чём |
|---|---|
| [`docs/redesign/README.md`](docs/redesign/README.md) | **Редизайн главной по макету Figma — активная задача.** Правила, процесс, реестр блоков |
| [`docs/VERSIONS.md`](docs/VERSIONS.md) | Несколько версий главной для показа заказчику: хаб `/versions`, как добавить новую версию |
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




запиши себе в бэклог или начни делать сейчас, сам реши

по контактам:



Так, смотри, по поводу, ты спрашивал трех кнопок, группа в Телеграм, видимо, Founders тоже, что-то еще. Короче, во-первых, WhatsApp и Telegram, а на Woman Space меняем на старые, которые были, с Анна Турбина и там, где номер телефона. Везде. Вот. Но меняй не хардкоре, а меняй через Sanity, чтобы у нас все редактировалось через Sanity, в том числе все контакты, которые у нас, например, вот этой правой менюшке, которая всегда ездит, и на «Хочу с вами», на странице тура. Короче, нужно, чтобы было отдельное поле, отдельные два пункта в Sanity, наверное, в настройках сайта. Это контакты WhatsApp, Telegram основные, которые будут отображаться у нас на «Хочу с вами», на «Обсудить идею» и на вот этом ездящей менюшке справа внизу. И отдельно в настройках футера, я не знаю, где у нас настройки футера, чтобы все вот эти вот контакты, кроме «Календарь путешествий» у нас это просто на раздел туры, насколько я понимаю, идет, «Индивидуальные маршруты» на раздел «Сотрудничество», да. А все остальные контакты, чтобы они прописывались вручную через Sanity, но ты их предзаполни. Страницу Custom Tour сейчас скрой, она не нужна, чтобы все кнопки, которые на нее ведут, просто либо вели на раздел сотрудничества, который на главной, либо открывали контакты, как, например, в Обсудить идею. Вот, разберись с этим всем делом.
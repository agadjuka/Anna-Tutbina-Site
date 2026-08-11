# ONÁ — сайт авторских женских туров

Сайт авторских женских туров и ретритов с Анной Турбиной.
Прод: https://www.ona-womantravel.com

Весь контент (тексты, фото, цены, программы туров, отзывы, FAQ) редактируется в Sanity Studio,
в коде его нет.

> **Агентам и разработчикам:** начинайте с [`CLAUDE.md`](CLAUDE.md) и [`docs/`](docs/README.md) —
> там архитектура, модель контента, дизайн-система и список известных проблем.
> Этот README — только про установку и запуск.

## Стек

- **Next.js** 16.0.10 — App Router, Turbopack
- **React** 19.2
- **TypeScript** 5
- **Tailwind CSS** 4 — конфигурация через `@theme` в `app/globals.css`, без `tailwind.config`
- **Sanity** 4 — CMS, Studio лежит в `sanity/` отдельным npm-пакетом

## Требования

- Node.js 20+, npm 10+
- В `.npmrc` включён `legacy-peer-deps=true` — без него React 19 + Sanity не ставятся

## Установка

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/agadjuka/Anna-Tutbina-Site.git
   ```

2. **Установите зависимости фронтенда:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения** — скопируйте `.env.example` в `.env.local` и подставьте
   значения (ID проекта берётся в настройках Sanity: sanity.io → проект → API):
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
   Секретных токенов в проекте нет: сайт контент только читает.

4. **Запустите dev-сервер:**
   ```bash
   npm run dev
   ```
   → [http://localhost:3000](http://localhost:3000)

5. **Sanity Studio (если нужно править контент локально):**
   ```bash
   npm --prefix sanity install
   npm run sanity:dev
   ```
   → [http://localhost:3333](http://localhost:3333)

## ⚠️ Сайт открыт не полностью

Сейчас действуют временные ограничения доступа: [`middleware.ts`](middleware.ts) редиректит всё,
кроме белого списка туров, на `/tours/kas`, а навигация в шапке скрыта флагом. **Это сделано
намеренно.** Поэтому `http://localhost:3000/` уводит на страницу тура, а не на главную.

Чтобы посмотреть сайт целиком, откройте его через служебный префикс:
`http://localhost:3000/admin/`.

Как снять ограничения — [`docs/remove-restrictions.md`](docs/remove-restrictions.md).

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер Next.js |
| `npm run build` | Прод-сборка; хук `prebuild` сначала прогоняет `update-fonts` |
| `npm run start` | Прод-сервер после сборки |
| `npm run lint` | ESLint |
| `npm run update-fonts` | Перегенерирует `lib/fonts.ts` из `public/fonts/` |
| `npm run sanity:dev` | Sanity Studio локально |
| `npm run sanity:deploy` | Деплой Studio |
| `npm run reinstall` | Полная переустановка зависимостей с чисткой кэша |
| `npx tsc --noEmit` | Проверка типов фронтенда |
| `npx tsc --noEmit -p sanity/tsconfig.json` | Проверка типов схем Studio |

**`lib/fonts.ts` — генерируемый файл.** Правки руками затираются при сборке. Чтобы поменять
шрифты, положите файлы в `public/fonts/{headings,body,logo}/` и запустите `npm run update-fonts`.

## Структура

```
app/                     # роуты App Router
  layout.tsx             # шрифты, Header/Footer, глобальные meta
  page.tsx               # главная
  tours/[slug]/          # страницы туров
  custom-tour/           # индивидуальный тур
  globals.css            # Tailwind @theme: цвета, шрифты, базовые стили
components/sections/     # секции страниц
components/ui/           # примитивы: Container, Button, SanityImage…
lib/
  sanity.client.ts       # клиент Sanity
  sanity.queries.ts      # все GROQ-запросы
  tour-visibility.ts     # правило hideFromSite
sanity/                  # Studio: схемы, структура, конфиг (отдельный npm-пакет)
scripts/update-fonts.ts  # генератор lib/fonts.ts
middleware.ts            # временные ограничения доступа + /admin-обход
docs/                    # документация проекта
```

## Деплой

Фронтенд — Vercel, деплоится автоматически по пушу в `master`; переменные окружения задаются
в настройках проекта Vercel. Studio деплоится отдельно командой `npm run sanity:deploy`.

Изменения контента в Sanity видны на сайте сразу — страницы рендерятся динамически,
пересборка не нужна.

## Полезные ссылки

- **Прод:** https://www.ona-womantravel.com
- **Sanity Studio:** _проставить URL задеплоенной Studio_
- **Проект на Vercel:** _проставить ссылку_
- **Документация:** [`docs/README.md`](docs/README.md)

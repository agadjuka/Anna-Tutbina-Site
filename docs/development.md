# Разработка

## Окружение

Windows + PowerShell, Node 20, npm 10. В `.npmrc` включён `legacy-peer-deps=true` —
без него часть зависимостей (React 19 + Sanity) не ставится.

Путь к проекту содержит пробелы и кириллицу (`D:\Работа\Anna Turbina Site`) — в командах
шелла пути кавычить.

## Первый запуск

```bash
npm install
cp .env.example .env.local   # и подставить значения
npm run dev                  # http://localhost:3000
```

Из-за временных ограничений `http://localhost:3000/` редиректит на `/tours/kas`.
Полный сайт открывается через префикс: `http://localhost:3000/admin/`.

### Sanity Studio

Studio — **отдельный npm-пакет** с собственными зависимостями:

```bash
npm --prefix sanity install   # один раз, если sanity/node_modules отсутствует
npm run sanity:dev            # http://localhost:3333
```

Схемы Studio **не попадают** в `npx tsc --noEmit` фронтенда — `sanity/` исключён из корневого
`tsconfig.json`. Проверяйте их отдельно:

```bash
npx tsc --noEmit -p sanity/tsconfig.json
```

Именно из-за отсутствия этой привычки синтаксическая ошибка в `tour.ts` прожила в репозитории год
(см. [known-issues.md](known-issues.md)).

## Переменные окружения

| Переменная | Обязательна | Значение |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | да | ID проекта Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | нет, по умолчанию `production` | Датасет |
| `NEXT_PUBLIC_SANITY_API_VERSION` | нет, по умолчанию `2024-01-01` | Версия API |

Все переменные — `NEXT_PUBLIC_*`, то есть попадают в клиентский бандл. Секретов (токенов записи
Sanity) в проекте нет и быть не должно: сайт только читает контент.

Шаблон — `.env.example`, локальные значения — `.env.local` (в git не попадает).
В проекте лежат и `.env`, и `.env.local` с одинаковым содержимым; Next читает оба,
`.env.local` имеет приоритет.

Конфигурация Studio (`projectId`, `dataset`, `appId`) захардкожена в `sanity/sanity.config.ts`
и `sanity/sanity.cli.ts` — она не секретная.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер Next.js (Turbopack) |
| `npm run build` | Прод-сборка; хук `prebuild` сначала запускает `update-fonts` |
| `npm run start` | Прод-сервер после сборки |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Проверка типов фронтенда |
| `npx tsc --noEmit -p sanity/tsconfig.json` | Проверка типов схем Studio |
| `npm run update-fonts` | Перегенерация `lib/fonts.ts` из `public/fonts/` |
| `npm run sanity:dev` / `sanity:deploy` | Studio: запуск / деплой |
| `npm run reinstall` | Полная переустановка: снести `node_modules` + lock, почистить кэш, `npm i --legacy-peer-deps` |

## Проверка изменений

Автотестов в проекте нет. Минимальный чек перед коммитом:

1. `npx tsc --noEmit` — типы фронтенда.
2. `npx tsc --noEmit -p sanity/tsconfig.json` — типы схем, **если трогали `sanity/`**.
3. `npm run lint` — новых ошибок быть не должно (о существующих см.
   [known-issues.md](known-issues.md)).
4. `npm run build` — сборка проходит.
5. Визуально: главная и страница тура через `/admin/`, обязательно на мобильной ширине —
   почти вся сложная логика (карусели, раскрытие отзывов, выравнивание высот) заточена под мобильные.

## Деплой

Фронтенд — Vercel, деплой по пушу в `master`. Переменные окружения задаются в настройках проекта
Vercel (в репозитории их нет). Studio деплоится отдельно: `npm run sanity:deploy`.

Изменения контента в Sanity видны на сайте сразу — страницы рендерятся динамически, пересборка
не нужна.

## Что не коммитить

`.env*` (кроме `.env.example`), `node_modules/`, `.next/`, `sanity/dist/`, `sanity/node_modules/`,
`*.tsbuildinfo`, папки исходников `Фото/` и `Шрифты/` — всё уже перечислено в `.gitignore`.

## Правка контента в Sanity скриптом

Иногда контент быстрее (и надёжнее) поправить скриптом, чем руками в Studio —
например, поменять формат дат у всех туров разом. Как это делается в этом проекте:

1. **Скрипт должен лежать внутри `sanity/`** (например `sanity/scripts/fix.js`).
   Из скретчпада или из корня он не запустится: `sanity exec` резолвит
   `sanity/cli` относительно файла, а `node_modules` есть только в `sanity/`.
2. Запуск — из папки `sanity/`:
   ```bash
   npx sanity exec scripts/fix.js --with-user-token -- --dry
   ```
   `--with-user-token` берёт авторизацию из локальной сессии CLI (токен лежит в
   `~/.config/sanity/config.json`), отдельный токен в `.env` не нужен.
3. **Сначала всегда `--dry`.** Скрипт должен печатать «поле → было → станет» и
   **падать**, если текущее значение не совпало с ожидаемым: датасет боевой,
   правки видны на сайте сразу, откатывать можно только через историю документа.
4. После — удалить временный скрипт из репозитория, а сами изменения записать
   в документацию (что и зачем поменяли).

⚠️ **Изменили схему — нужен `npm run sanity:deploy`**, иначе новое поле не
появится в интерфейсе Studio (в данных оно при этом уже может быть).

Известные шероховатости деплоя (2026-08-20):
- `Extract manifest was aborted after 120000ms` — деплой при этом проходит,
  не пугаться. Манифест схемы нужен только схемозависимым функциям Sanity
  (AI-ассист, Create), лечится повторным деплоем.
- Локальные пакеты Studio могут отставать от рантайма (включены auto-updates) —
  CLI об этом предупреждает. Перед правкой схемы: `npm --prefix sanity install
  sanity@latest @sanity/vision@latest`.

## Траблшутинг

**`npm install` конфликтует по peer-зависимостям** — проверьте, что `.npmrc` с
`legacy-peer-deps=true` на месте; в крайнем случае `npm run reinstall`.

**Правка в Studio не появилась на сайте** — проверьте флаг `hideFromSite` у тура и наличие поля
в GROQ-запросе (`lib/sanity.queries.ts`). Кэш здесь ни при чём: он отключён.

**Изменил `lib/fonts.ts`, после сборки всё вернулось** — файл генерируется, правьте
`public/fonts/` и/или `scripts/update-fonts.ts`.

**Открываю `/`, кидает на `/tours/kas`** — так и задумано, см.
[remove-restrictions.md](remove-restrictions.md). Для просмотра — `/admin/`.

**Сборка ругается «The "middleware" file convention is deprecated»** — известная депрекация
Next 16, на работу не влияет, миграция в [known-issues.md](known-issues.md).

**`npx tsc -p sanity/tsconfig.json` сыплет «Cannot find module» (TS2792) на каждом импорте** —
проверьте, что в `sanity/tsconfig.json` есть `"moduleResolution": "bundler"`. Без него при
`"module": "ESNext"` резолвер откатывается в `classic` и не находит вообще ничего, даже когда
зависимости на месте. Если строчка есть, а ошибки остались — тогда уже
`npm --prefix sanity install`.

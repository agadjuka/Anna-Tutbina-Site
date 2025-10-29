# Anna Turbina Tours

Сайт авторских женских туров и ретритов с Анной Турбиной.

## Стек технологий

- **Next.js** 16.0.1 — React-фреймворк с App Router
- **TypeScript** — типизация кода
- **Tailwind CSS** — стилизация компонентов
- **Sanity.io** — CMS для управления контентом

## Запуск проекта локально

### Предварительные требования

- Node.js 18+ 
- npm или yarn

### Установка

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd "Anna Turbina Site"
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   
   Создайте файл `.env.local` в корне проекта и добавьте следующие переменные:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
   
   > **Важно:** Значение `NEXT_PUBLIC_SANITY_PROJECT_ID` необходимо получить из настроек проекта Sanity.

4. **Запустите фронтенд:**
   ```bash
   npm run dev
   ```
   
   Сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000)

5. **Запустите Sanity Studio (опционально):**
   ```bash
   npm run sanity:dev
   ```
   
   Sanity Studio будет доступен по адресу [http://localhost:3333](http://localhost:3333)

## Команды проекта

- `npm run dev` — запуск dev-сервера Next.js
- `npm run build` — сборка проекта для production
- `npm run start` — запуск production-сервера
- `npm run lint` — проверка кода линтером
- `npm run sanity:dev` — запуск Sanity Studio в режиме разработки
- `npm run sanity:deploy` — деплой Sanity Studio

## Структура проекта

```
├── app/                    # Страницы Next.js (App Router)
│   ├── layout.tsx         # Корневой layout с глобальными мета-тегами
│   ├── page.tsx           # Главная страница
│   ├── tours/[slug]/     # Динамические страницы туров
│   └── custom-tour/       # Страница индивидуального тура
├── components/            # React-компоненты
│   ├── sections/          # Секции страниц
│   └── ui/                # UI-компоненты
├── lib/                   # Утилиты и конфигурация
│   ├── sanity.client.ts   # Клиент Sanity
│   └── sanity.queries.ts  # GROQ-запросы к Sanity
└── sanity/                # Конфигурация Sanity Studio
    └── schemas/           # Схемы документов Sanity
```

## SEO-оптимизация

Проект использует встроенные механизмы Next.js для SEO:
- Глобальные мета-теги настроены в `app/layout.tsx`
- Динамические мета-теги для страниц туров генерируются через `generateMetadata`
- Статические мета-теги для основных страниц

## Полезные ссылки

- **Sanity Studio:** [ссылка после деплоя]
- **Деплой на Vercel:** [ссылка после деплоя]

## Дополнительная информация

Проект полностью функционален и готов к деплою. Все мета-теги настроены для базовой SEO-оптимизации.

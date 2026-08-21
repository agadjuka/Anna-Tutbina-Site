# План удаления системы версий главной

**Статус: НЕ ВЫПОЛНЯТЬ.** Это заготовка на будущее. Сейчас версии 1–5 просто
скрыты, код на месте — чтобы можно было в любой момент вернуться и сравнить.

**Контекст.** 2026-08-20 заказчик выбрал версию 6, она стала боевой главной
(`app/page.tsx` → `HomeV6`). Сравнение версий закончено, но сам механизм
(`/versions`, компоненты v1–v5) пока живёт в репозитории.

---

## Что уже сделано (текущее состояние — «скрыто, но не удалено»)

| Что | Как скрыто | Файл |
|---|---|---|
| Боевая главная | рендерит `HomeV6` вместо `HomeV1` | [`app/page.tsx`](../app/page.tsx) |
| Версии 1–5 | статус `archived` → пропали с хаба, прямые ссылки `/versions/v1…v5` работают | [`lib/versions.ts`](../lib/versions.ts) |
| Версия 6 на хабе | статус `ready`, подписана «основная (боевая главная)» | [`lib/versions.ts`](../lib/versions.ts) |
| Хаб `/versions` | публичное исключение в middleware снято → редиректит на `/tours/kas`, как и остальной сайт. Для себя открывается через `/admin/versions` | [`middleware.ts`](../middleware.ts) |
| `/stitch-preview/*` | под общим ограничением middleware, публично недоступен (так было и раньше) | — |

Проверить, что версии всё ещё доступны для себя:
`http://localhost:3000/admin/versions` и `http://localhost:3000/admin/versions/v3`.

---

## Как удалить, когда решим (порядок важен)

### Шаг 1. Роуты и реестр версий

```
удалить  app/versions/                       (page.tsx + [id]/page.tsx)
удалить  lib/versions.ts
удалить  components/versions/registry.tsx
удалить  components/versions/version-badge.tsx
удалить  components/versions/force-motion.tsx
```

### Шаг 2. Компоненты версий 1–5

```
удалить  components/versions/home-v1.tsx
удалить  components/versions/home-v2.tsx
удалить  components/versions/home-v3.tsx
удалить  components/versions/home-v4.tsx
удалить  components/versions/home-v5.tsx
```

`components/versions/home-v6.tsx` — **оставить**, это боевая главная. Логичнее
всего перенести его код прямо в `app/page.tsx` (или переименовать в
`components/sections/home.tsx`) и убрать папку `components/versions/` целиком —
после удаления v1–v5 слово «версия» в названии перестаёт что-либо значить.

### Шаг 3. Секции, которые останутся без пользователей

После удаления v1–v5 на них не будет ни одной ссылки — проверить `grep` перед
удалением:

```
удалить  components/sections/hero-section.tsx                  (был у v1, v2)
удалить  components/sections/values-section.tsx                 (был у v1, v2)
удалить  components/sections/hero-section-fullscreen.tsx        (был у v3)
```

Остаются в работе (их использует v6): `hero-section-fullscreen-v4.tsx`,
`values-section-editorial.tsx`, `about/calendar/guests/founders/reviews/collab/faq`,
`components/ui/reveal.tsx`.

После этого разумно переименовать для чистоты:
`hero-section-fullscreen-v4.tsx` → `hero-section.tsx`,
`values-section-editorial.tsx` → `values-section.tsx` (имена освободятся).

### Шаг 4. CSS в `app/globals.css`

⚠️ Блоки идут в файле подряд, номера строк поплывут после первого же удаления —
ориентироваться на комментарии-заголовки `/* --- … --- */`, а не на номера.

```
удалить   блок «Версия 2 главной: „лёгкие анимации“»     (~строки 359–443, всё про .animated-preview)
удалить   блок «Версия 5: анимации по всему сайту»       (~строки 631–730, всё про .v5-scene)
```

**Оставить** (это работающая главная, не версии):

- блок «Версия 6: кинематографичный скролл» — `.v6-scene` / `.v6-cine`;
- блок «Шапка поверх полноэкранного HERO» — `body:has([data-hero-fullscreen="all"])`;
  из него можно убрать только правило с `data-hero-fullscreen="mobile"` (оно было
  нужно v3, у v6 HERO полноэкранный везде);
- блок «Анимация первого экрана (блок HERO)» и блок, озаглавленный
  «Версия 3: мобильный HERO на весь экран» — **заголовок врёт**: там `heroKenburns`
  и `hero-scroll-cue`, которые использует и HERO версии 6. Блок оставить,
  комментарий переписать;
- блоки футера (дыхание колец, «вода») — общие для всего сайта.

Все правила `html[data-force-motion="true"] …` и парные к ним
`html:not([data-force-motion="true"]) …` можно упростить вместе с удалением
`force-motion.tsx`: атрибут ставился только на `/versions/*`. После этого
`prefers-reduced-motion` начнёт соблюдаться на главной без исключений —
**это осознанное изменение поведения**, стоит проверить, что при включённой
системной настройке страница не остаётся пустой (секции должны показываться
хотя бы прозрачностью).

### Шаг 5. Middleware

Удалить комментарий про снятое исключение `/versions` в
[`middleware.ts`](../middleware.ts) — на тот момент он уже ничего не объясняет.

### Шаг 6. Экспериментальные прототипы (можно тем же заходом)

Это не «версии», а более ранние черновики из Stitch, публично недоступны:

```
удалить  app/stitch-preview/
удалить  components/stitch/
```

### Шаг 7. Документация

```
удалить  docs/VERSIONS.md
удалить  docs/versions-cleanup-plan.md   (этот файл)
удалить  «версия 6/»                     (исходный пакет от заказчика в корне репо, не в git)
править  CLAUDE.md                       — строку про docs/VERSIONS.md в таблице документации
править  docs/architecture.md            — упоминания /versions и HomeV1
править  docs/redesign/README.md         — упоминания версий
править  ИНСТРУКЦИЯ.md                   — пункт 2 «Версии главной страницы» (ссылка для заказчика)
```

### Шаг 8. Проверка

```bash
npx tsc --noEmit
```

```bash
npm run build
```

Плюс визуальный прогон `http://localhost:3000/admin/` — главная, все секции,
меню, якоря, футер.

---

## Чего этот план НЕ касается

Временные ограничения доступа (`middleware.ts` + `HIDE_NAVIGATION` в
`header.tsx`) — отдельная тема, снимаются по своей инструкции:
[`docs/remove-restrictions.md`](remove-restrictions.md).

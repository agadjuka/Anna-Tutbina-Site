# Задача Н1 — Контакты через Sanity

**Дата:** 2026-08-12  
**Статус:** ✅ Код готов, требуется заполнение данных в Sanity Studio

---

## Что сделано

### 1. Расширена схема Sanity

**Файл:** `sanity/schemas/siteSettings.ts`

Добавлено новое поле `primaryContacts` — массив контактов с полями:
- `label` — название контакта (например, "Telegram", "WhatsApp")
- `url` — полная ссылка (например, `https://t.me/Anna_Turbina`)
- `icon` — тип иконки (telegram/whatsapp/instagram/phone)

**Предзаполненные значения:**
- Telegram: `https://t.me/Anna_Turbina`
- WhatsApp: `https://wa.me/79539527212`

### 2. Обновлен GROQ-запрос

**Файл:** `lib/sanity.queries.ts`

Добавлено поле `primaryContacts[]{label, url, icon}` в запрос `siteSettingsQuery`.

### 3. Обновлены компоненты контактов

#### FloatingContacts (плавающая кнопка справа внизу)
- **Старый файл:** `components/ui/floating-contacts.tsx` — был клиентским с хардкодом
- **Новые файлы:**
  - `components/ui/floating-contacts.tsx` — серверный компонент, читает из Sanity
  - `components/ui/floating-contacts-button.tsx` — клиентская кнопка

#### WantToJoinButton (кнопка "Хочу с Вами!" на странице тура)
- **Файл:** `components/sections/want-to-join-button.tsx`
- Теперь принимает контакты через props вместо хардкода

#### ContactCta (кнопка "Обсудить идею" в блоке COLLAB)
- **Файл:** `components/ui/contact-cta.tsx`
- Убран хардкоженный массив `CONTACTS`
- Теперь принимает контакты через props

### 4. Обновлены страницы

#### Главная страница
**Файл:** `app/page.tsx`
- Добавлен запрос `siteSettings` в `Promise.all`
- Передаются `primaryContacts` в `CollabSection`

#### Страница тура
**Файл:** `app/tours/[slug]/page.tsx`
- Добавлен запрос `siteSettings` в `Promise.all`
- Передаются `primaryContacts` в `WantToJoinButton`

#### CollabSection
**Файл:** `components/sections/collab-section.tsx`
- Добавлен проп `primaryContacts`
- Передаёт контакты в `ContactCta`

### 5. Скрыта страница /custom-tour

**Файл:** `middleware.ts`

Добавлен редирект:
```typescript
if (pathname === '/custom-tour') {
  return NextResponse.redirect(new URL('/#collab', request.url));
}
```

Теперь все ссылки на `/custom-tour` ведут на главную страницу с якорем `#collab` (секция "Сотрудничество").

---

## Изменённые файлы

1. `sanity/schemas/siteSettings.ts` — добавлено поле `primaryContacts`
2. `lib/sanity.queries.ts` — обновлён `siteSettingsQuery`
3. `components/ui/floating-contacts.tsx` — переписан как серверный компонент
4. `components/ui/floating-contacts-button.tsx` — новый файл (клиентская часть)
5. `components/sections/want-to-join-button.tsx` — принимает контакты через props
6. `components/ui/contact-cta.tsx` — принимает контакты через props
7. `components/sections/collab-section.tsx` — передаёт контакты в ContactCta
8. `app/page.tsx` — загружает siteSettings и передаёт контакты
9. `app/tours/[slug]/page.tsx` — загружает siteSettings и передаёт контакты
10. `middleware.ts` — редирект /custom-tour → /#collab

---

## Что нужно сделать дальше

### ⚠️ Обязательно: Заполнить данные в Sanity Studio

1. **Запустить Sanity Studio:**
   ```bash
   npm run sanity:dev
   ```
   Откроется на `http://localhost:3333`

2. **Создать документ "Настройки сайта":**
   - Зайти в раздел "Настройки сайта"
   - Если документ не создан — создать его
   - Заполнить поля:
     - **Слоган в футере** (уже есть)
     - **Колонка "Связаться"** (уже есть, проверить ссылки)
     - **Колонка "Сообщество"** (уже есть, проверить ссылки)
     - **Основные контакты** — НОВОЕ ПОЛЕ:
       - Telegram: `https://t.me/Anna_Turbina`
       - WhatsApp: `https://wa.me/79539527212`

3. **Проверить контакты в футере:**
   - **"Связаться"** должны быть:
     - Telegram: `https://t.me/Anna_Turbina`
     - WhatsApp: `https://wa.me/79539527212`
     - Instagram (если нужен)
   
   - **"Сообщество"** должны быть:
     - Календарь путешествий → `/#tours`
     - Индивидуальные маршруты → `/#collab`
     - Группа в Telegram (если есть ссылка)

4. **Опубликовать изменения** в Studio

---

## Как проверить работу

### 1. Запустить dev-сервер
```bash
npm run dev
```

### 2. Проверить на главной странице

Открыть `http://localhost:3000/admin/` (через `/admin` обходим временные ограничения)

**Проверить:**
- ✅ Плавающая кнопка справа внизу раскрывает контакты из Sanity
- ✅ Блок "Сотрудничество" → кнопка "Обсудить идею" раскрывает контакты
- ✅ Футер показывает правильные контакты (старые, Анны Турбиной)

### 3. Проверить на странице тура

Открыть любой тур, например: `http://localhost:3000/tours/kas`

**Проверить:**
- ✅ Кнопка "Хочу с Вами!" внизу раскрывает контакты из Sanity
- ✅ Плавающая кнопка работает

### 4. Проверить редирект

Открыть `http://localhost:3000/custom-tour`

**Ожидаемое поведение:**
- ✅ Редирект на главную с якорем `/#collab`

---

## Технические детали

### Проверка типов
```bash
npx tsc --noEmit                        # Проверка фронтенда
npx tsc --noEmit -p sanity/tsconfig.json  # Проверка схем Sanity
```

Обе проверки прошли успешно ✅

### Коммит

```
Добавлены редактируемые контакты через Sanity

- Расширена схема siteSettings с полем primaryContacts
- Обновлен siteSettingsQuery для получения primaryContacts  
- FloatingContacts теперь серверный компонент
- WantToJoinButton и ContactCta принимают контакты через props
- /custom-tour редиректит на /#collab
- Предзаполнены контакты Анны Турбиной

Задача Н1 из бэклога
```

### Текущий коммит
Последний коммит в ветке `feature/homepage-redesign`

---

## Следующие задачи из бэклога

После Н1 идут:

- **Н2.** Система тестовых страниц
- **Н3.** HERO вынести в отдельную страницу (десктоп)
- **Н4.** HERO мобильный через Stitch
- **Н5.** Версия с мини-анимациями
- **Н6.** Версия с "очень крутыми" анимациями

**Важно:** заказчик требует **обсуждать каждую задачу перед началом**.

---

## Примечания

- Все контакты теперь редактируются через Sanity Studio
- Старые контакты Анны Турбиной возвращены (вместо Woman Space)
- Страница `/custom-tour` скрыта, но доступна через `/admin/custom-tour`
- Иконки контактов рендерятся автоматически по полю `icon`
- Поддерживаются типы: telegram, whatsapp, instagram, phone

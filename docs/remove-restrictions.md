# Как убрать временные ограничения

### 1. Вернуть все страницы сайта:
В корне проекта удалите файл `middleware.ts` или переименуйте его (например, в `middleware.ts.off`).

### 2. Вернуть кнопки в хедере:
В файле `components/sections/header.tsx` поменяйте:
```tsx
const HIDE_NAVIGATION = true;
```
на
```tsx
const HIDE_NAVIGATION = false;
```

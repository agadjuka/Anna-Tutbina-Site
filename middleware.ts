import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Разрешаем любой путь, если в нем есть /admin/
  // Это позволяет обходить ограничения, просто добавив префикс в URL
  if (pathname.startsWith('/admin/') || pathname === '/admin') {
    const targetPath = pathname.replace('/admin', '') || '/';
    return NextResponse.rewrite(new URL(targetPath, request.url));
  }

  // ⚠️ Якорь `#collab` тут ни на что не влияет: фрагмент URL не уходит на сервер,
  // поэтому со стороны middleware следующий запрос — просто `/`, и он попадает под
  // общее ограничение ниже (не входит в allowedPaths) → редиректит в /tours/kas,
  // а не на секцию сотрудничества. Оставлено как есть: реальный сценарий, который
  // это должно было чинить, уже решён в другом месте — кнопка «Обсудить идею»
  // в COLLAB больше не ведёт на /custom-tour вообще, а раскрывает контакты на месте
  // (см. `collab-section.tsx` / `contact-cta.tsx`), так что публично на этот путь
  // никто не попадает. Актуально только в обход `/admin/custom-tour`.
  if (pathname === '/custom-tour') {
    return NextResponse.redirect(new URL('/#collab', request.url));
  }

  // ⚠️ Сравнение версий завершено (2026-08-20): заказчик выбрал версию 6, она
  // стала боевой главной. Прежнее публичное исключение для `/versions` снято —
  // теперь эти страницы попадают под общее ограничение ниже и публично
  // недоступны. Для себя они по-прежнему открываются через обход:
  // `/admin/versions` и `/admin/versions/v6`. Полностью удалить их — по плану
  // `docs/versions-cleanup-plan.md` (сейчас намеренно НЕ удаляем).

  const allowedPaths = ['/tours/kas', '/tours/bali-padelcamp', '/tours/bali-padelsurfcamp', '/tours/bali', '/tours/capetown', '/tours/capetown2'];
  const defaultRedirect = '/tours/kas';

  if (!allowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL(defaultRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Применяем ко всем путям, кроме:
     * - api (руты API)
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - любые файлы с расширением (картинки, шрифты и т.д.)
     */
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};

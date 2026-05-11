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

  // Если это не наша разрешенная страница, перенаправляем на неё
  if (pathname !== '/tours/kas') {
    return NextResponse.redirect(new URL('/tours/kas', request.url));
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

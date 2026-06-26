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

  const allowedPaths = ['/tours/kas', '/tours/bali-padelcamp'];
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

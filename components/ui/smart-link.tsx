"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Ссылка, которая сама сохраняет префикс `/admin`, если мы смотрим сайт через
 * обходной путь из `middleware.ts`.
 *
 * Зачем: на время редизайна `middleware.ts` редиректит всё, кроме белого списка
 * туров, на `/tours/kas`, а `/admin/*` переписывается на реальный маршрут. Из-за
 * этого ссылка вида `/#values`, открытая со страницы `/admin`, уводила на `/` →
 * редирект → «страница не та». Здесь префикс подставляется динамически:
 *
 * - смотрим через `/admin` → `/custom-tour` превращается в `/admin/custom-tour`;
 * - смотрим обычную версию (или после снятия ограничений) → адрес не меняется.
 *
 * Поэтому ничего не сломается, когда ограничения снимут и `/admin` исчезнет —
 * специально убирать эти ссылки не придётся.
 *
 * Внешние ссылки, `#якоря`, `mailto:` и `tel:` не трогаются.
 */
function withBasePath(href: string, basePath: string): string {
  if (!basePath) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href; // http(s):, mailto:, tel: …
  if (href.startsWith("#")) return href; // якорь на текущей странице
  if (href === "/") return basePath;
  if (href.startsWith("/#")) return `${basePath}${href.slice(1)}`; // '/#tours' → '/admin#tours'
  if (href.startsWith("/")) return `${basePath}${href}`;
  return href;
}

interface SmartLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
}

export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const pathname = usePathname();
  const underAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <Link href={withBasePath(href, underAdmin ? "/admin" : "")} {...rest}>
      {children}
    </Link>
  );
}

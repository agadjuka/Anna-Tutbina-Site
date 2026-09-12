import type { Metadata } from "next";
import "./globals.css";
import {
  headingFont,
  bodyFont,
  logoFont,
  logoSubtitleFont,
  handwritingFont,
} from "@/lib/fonts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { FloatingContacts } from "@/components/ui/floating-contacts";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ona-womantravel.com"),
  title: {
    template: "%s | ONÁ",
    default: "ONÁ",
  },
  description: "Авторские женские туры и ретриты с Анной Турбиной",
  alternates: {
    canonical: "/",
  },
  manifest: "/Logo/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ONÁ",
    url: "/",
    title: "ONÁ",
    description: "Авторские женские туры и ретриты с Анной Турбиной",
    images: [
      {
        url: "https://www.ona-womantravel.com/Logo/web-app-manifest-512x512.png",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONÁ",
    description: "Авторские женские туры и ретриты с Анной Турбиной",
    images: ["https://www.ona-womantravel.com/Logo/web-app-manifest-512x512.png"],
  },
  appleWebApp: {
    capable: true,
    title: "ONÁ",
    statusBarStyle: "default",
  },
};

/**
 * ПЛАВНОЕ ПРОЯВЛЕНИЕ ПЕРВОГО ЭКРАНА ПО ГОТОВНОСТИ ШРИФТОВ.
 *
 * Сами шрифты подключены без подмены (`display: block` + предзагрузка + WOFF2,
 * см. `scripts/update-fonts.ts`): текст не рисуется запасным шрифтом, пока не
 * пришёл фирменный. Но у `block` каждый шрифт «проявляет» свой текст в свой
 * момент — логотип, заголовок, рукописная строка всплывали бы вразнобой. Этот
 * скрипт собирает их в одно движение: пока все пять шрифтов не загружены, на
 * `<html>` висит `data-fonts="loading"`, и CSS (`globals.css`, «Проявление
 * первого экрана») держит текст шапки и первого экрана прозрачным, а его
 * анимацию появления — на паузе. Когда шрифты готовы, всё проявляется разом.
 *
 * Надёжность:
 * - атрибут ставит сам скрипт — без JS ничего не прячется;
 * - через 3 с атрибут снимается в любом случае (≈ потолок `font-display: block`);
 * - `document.fonts.load()` возвращает пустой список, пока браузер ещё не
 *   разобрал CSS с `@font-face`, — тогда повторяем через 50 мс, а не считаем
 *   шрифт загруженным;
 * - скрипт в `<head>`, до первой отрисовки; на клиентских переходах между
 *   страницами он не перезапускается (шрифты к тому моменту уже загружены).
 */
const FONT_FAMILIES = [headingFont, bodyFont, logoFont, logoSubtitleFont, handwritingFont].map(
  (f) => f.style.fontFamily.split(",")[0].trim()
);
const FONTS_READY_SCRIPT = `(function(){var d=document,r=d.documentElement,f=d.fonts;if(!f||!f.load)return;r.setAttribute("data-fonts","loading");var fams=${JSON.stringify(
  FONT_FAMILIES
)},fin=false;function done(){if(fin)return;fin=true;r.removeAttribute("data-fonts")}setTimeout(done,3000);function attempt(){Promise.all(fams.map(function(x){return f.load("1em "+x)})).then(function(res){for(var i=0;i<res.length;i++){if(!res[i].length){setTimeout(attempt,50);return}}done()},done)}attempt()})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * `suppressHydrationWarning` на `<html>`: атрибуты на корень ставит наш
   * скрипт шрифтов ниже (`data-fonts`) и расширения браузера. До
   * 11.09.2026 здесь же был `data-ona-scale` масштаба главной (удалён — размеры
   * теперь в самих компонентах). React такие атрибуты в SSR-выводе не ждёт и
   * ругается «hydrated but some attributes … didn't match». Флаг действует
   * ровно на один уровень — на сам `<html>`; содержимое страницы React
   * по-прежнему сверяет как обычно.
   */
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable} ${logoSubtitleFont.variable} ${handwritingFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: FONTS_READY_SCRIPT }} />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <FloatingContacts />
        <Footer />
      </body>
    </html>
  );
}

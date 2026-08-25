import type { Metadata } from "next";
import "./globals.css";
import { headingFont, bodyFont, logoFont, logoSubtitleFont } from "@/lib/fonts";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * `suppressHydrationWarning` на `<html>` — из-за масштаба главной. Там
   * `data-ona-scale="v8"` ставится инлайновым скриптом ещё до гидрации (см.
   * `components/home/home-light.tsx`), иначе первый кадр рисуется макетными
   * кеглями и на глазах ужимается. React такого атрибута в своём SSR-выводе не
   * ждёт и ругается «hydrated but some attributes … didn't match»: сам атрибут
   * он не трогает, но пишет ошибку в консоль на каждой загрузке. Флаг действует
   * ровно на один уровень — на сам `<html>`; содержимое страницы React
   * по-прежнему сверяет как обычно.
   */
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable} ${logoSubtitleFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Header />
        {children}
        <FloatingContacts />
        <Footer />
      </body>
    </html>
  );
}

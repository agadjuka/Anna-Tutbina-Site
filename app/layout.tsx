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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * `suppressHydrationWarning` на `<html>`: атрибуты на корень ставят и наш код
   * (`data-force-motion` на страницах версий), и расширения браузера. До
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
      <body className="antialiased">
        <Header />
        {children}
        <FloatingContacts />
        <Footer />
      </body>
    </html>
  );
}

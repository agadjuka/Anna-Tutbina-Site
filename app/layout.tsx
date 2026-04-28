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
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/Logo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ONÁ",
    url: "/",
    title: "ONÁ",
    description: "Авторские женские туры и ретриты с Анной Турбиной",
    images: [
      {
        url: "/Logo/web-app-manifest-512x512.png",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONÁ",
    description: "Авторские женские туры и ретриты с Анной Турбиной",
    images: ["/Logo/web-app-manifest-512x512.png"],
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
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable} ${logoSubtitleFont.variable}`}
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

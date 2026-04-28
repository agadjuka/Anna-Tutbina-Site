import type { Metadata } from "next";
import "./globals.css";
import { headingFont, bodyFont, logoFont, logoSubtitleFont } from "@/lib/fonts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { FloatingContacts } from "@/components/ui/floating-contacts";

export const metadata: Metadata = {
  title: {
    template: "%s | ONÁ",
    default: "ONÁ",
  },
  description: "Авторские женские туры и ретриты с Анной Турбиной",
  manifest: "/Logo/site.webmanifest",
  icons: {
    icon: [{ url: "/Logo/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/Logo/favicon.svg"],
    apple: ["/Logo/favicon.svg"],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ONÁ",
    images: [
      {
        url: "/Logo/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/Logo/favicon.svg"],
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

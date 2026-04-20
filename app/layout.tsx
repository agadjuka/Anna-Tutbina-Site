import type { Metadata } from "next";
import "./globals.css";
import { headingFont, bodyFont, logoFont } from "@/lib/fonts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { FloatingContacts } from "@/components/ui/floating-contacts";

export const metadata: Metadata = {
  title: {
    template: "%s | ONÁ",
    default: "ONÁ",
  },
  description: "Авторские женские туры и ретриты с Анной Турбиной",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable}`}
    >
      <body className="pt-16 antialiased">
        <Header />
        {children}
        <FloatingContacts />
        <Footer />
      </body>
    </html>
  );
}

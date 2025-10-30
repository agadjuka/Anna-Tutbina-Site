import type { Metadata } from "next";
import "./globals.css";
import { ttDrugs, theanoDidot, leotaro, kinetika } from "@/lib/fonts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { FloatingContacts } from "@/components/ui/floating-contacts";

export const metadata: Metadata = {
  title: {
    template: "%s | Anna Turbina Tours",
    default: "Anna Turbina Tours",
  },
  description: "Авторские женские туры и ретриты с Анной Турбиной",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`pt-16 ${ttDrugs.variable} ${theanoDidot.variable} ${leotaro.variable} ${kinetika.variable} antialiased`}
      >
        <Header />
        {children}
        <FloatingContacts />
        <Footer />
      </body>
    </html>
  );
}

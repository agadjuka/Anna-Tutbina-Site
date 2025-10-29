import type { Metadata } from "next";
import "./globals.css";
import { ttDrugs, theanoDidot } from "@/lib/fonts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

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
        className={`${ttDrugs.variable} ${theanoDidot.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

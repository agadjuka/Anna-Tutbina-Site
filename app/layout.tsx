import type { Metadata } from "next";
import "./globals.css";
import { ttDrugs, theanoDidot } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Anna Turbina Tours",
  description: "Эксклюзивные туры от Anna Turbina",
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
        {children}
      </body>
    </html>
  );
}

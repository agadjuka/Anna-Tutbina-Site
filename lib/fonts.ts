import localFont from "next/font/local";

// Автоматически сгенерировано скриптом update-fonts.ts
// Для обновления запустите: npm run update-fonts

// Шрифт для заголовков из public/fonts/headings/
export const headingFont = localFont({
  src: "../public/fonts/headings/dance_partner.ttf",
  variable: "--font-heading",
  display: "swap",
  fallback: ["serif"],
  weight: "400",
});

// Шрифт для основного текста из public/fonts/body/
export const bodyFont = localFont({
  src: "../public/fonts/body/kinetika.ttf",
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "arial"],
  weight: "400",
});

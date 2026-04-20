import localFont from "next/font/local";

// Автоматически сгенерировано скриптом update-fonts.ts
// Для обновления запустите: npm run update-fonts

// Шрифт для заголовков из public/fonts/headings/
export const headingFont = localFont({
  src: "../public/fonts/headings/Cormorant-Regular.ttf",
  variable: "--font-heading",
  display: "swap",
  fallback: ["Cormorant Garamond", "Times New Roman", "serif"],
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

// Логотип из public/fonts/logo/
export const logoFont = localFont({
  src: "../public/fonts/logo/LaLuxes-regular.otf",
  variable: "--font-logo",
  display: "swap",
  fallback: ["Georgia", "serif"],
  weight: "400",
});

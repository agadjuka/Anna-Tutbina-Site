import localFont from "next/font/local";

// Автоматически сгенерировано скриптом update-fonts.ts
// Для обновления запустите: npm run update-fonts

// Шрифт для заголовков из public/fonts/headings/
export const headingFont = localFont({
  src: "../public/fonts/headings/Cormorant-Regular.woff2",
  variable: "--font-heading",
  display: "block",
  fallback: ["Cormorant Garamond", "Times New Roman", "serif"],
  weight: "400",
});

// Шрифт для основного текста из public/fonts/body/
export const bodyFont = localFont({
  src: "../public/fonts/body/Gilroy-Light.woff2",
  variable: "--font-body",
  display: "block",
  fallback: ["system-ui", "arial"],
  weight: "300",
});

// Логотип из public/fonts/logo/
export const logoFont = localFont({
  src: "../public/fonts/logo/LaLuxes-regular.woff2",
  variable: "--font-logo",
  display: "block",
  fallback: ["Georgia", "serif"],
  weight: "400",
});

// Шрифт для подзаголовка логотипа
export const logoSubtitleFont = localFont({
  src: "../public/fonts/logo/MADE TheArtist Script PERSONAL USE.woff2",
  variable: "--font-logo-subtitle",
  display: "block",
  fallback: ["Georgia", "serif"],
  weight: "400",
});

// Рукописный акцент из public/fonts/handwriting/
export const handwritingFont = localFont({
  src: "../public/fonts/handwriting/Denistina-Regular.woff2",
  variable: "--font-handwriting",
  display: "block",
  fallback: ["Segoe Script", "Brush Script MT", "cursive"],
  weight: "400",
});

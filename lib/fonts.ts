import localFont from "next/font/local";

// TT Drugs для основного текста
export const ttDrugs = localFont({
  src: [
    {
      path: "../public/fonts/tt-drugs-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-drugs-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-drugs-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-drugs-thin.otf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-tt-drugs",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

// Theano Didot для заголовков
export const theanoDidot = localFont({
  src: "../public/fonts/theano-didot-regular.ttf",
  variable: "--font-theano-didot",
  display: "swap",
  fallback: ["serif"],
});

// Leotaro для заголовков
export const leotaro = localFont({
  src: "../public/fonts/leotaro-regular.otf",
  variable: "--font-leotaro",
  display: "swap",
  fallback: ["serif"],
});

// Кинетика для основного текста
export const kinetika = localFont({
  src: "../public/fonts/kinetika.ttf",
  variable: "--font-kinetika",
  display: "swap",
  fallback: ["system-ui", "arial"],
});


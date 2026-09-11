import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Автоматически обновляет lib/fonts.ts на основе шрифтов в папках
 * Запускайте этот скрипт после добавления новых шрифтов в папки
 *
 * ⚠️ ЗАГРУЗКА ШРИФТОВ БЕЗ «МИГАНИЯ» (11.09.2026). Все фирменные шрифты:
 *
 * 1. **WOFF2 с подмножеством символов** (латиница + кириллица + пунктуация,
 *    с сохранением кернинга и лигатур). Исходные TTF/OTF весили 791 КБ на пять
 *    файлов (один Cormorant — 481 КБ), WOFF2 — 236 КБ. Новый шрифт класть
 *    сюда уже сжатым; команда — в `docs/design-system.md`, «Шрифты».
 * 2. **`display: "block"`, а не `"swap"`.** Со `swap` браузер сначала рисует
 *    текст запасным шрифтом и подменяет его, когда догрузится фирменный, —
 *    на первом экране это и было «мигание шрифта» (замечание Ильи). С `block`
 *    текст не рисуется, пока шрифт не пришёл (у предзагруженного WOFF2 с того
 *    же домена — миллисекунды), и подмены нет вовсе. Потолок ожидания задаёт
 *    браузер (~3 с), дальше — запасной шрифт.
 * 3. **Предзагрузка у всех**, включая рукописный (раньше `preload: false`).
 *
 * Плавное проявление текста первого экрана по готовности шрифтов — в
 * `app/layout.tsx` (скрипт `fonts-loading`) и `globals.css` (`.fonts-loading`).
 */

const fontsDir = join(process.cwd(), "public", "fonts");
const headingsDir = join(fontsDir, "headings");
const bodyDir = join(fontsDir, "body");
const logoDir = join(fontsDir, "logo");
/** Рукописный акцент (подпись под заголовком первого экрана). */
const handwritingDir = join(fontsDir, "handwriting");
const outputFile = join(process.cwd(), "lib", "fonts.ts");

function getFallback(folder: string): string {
  if (folder === "headings")
    return '["Cormorant Garamond", "Times New Roman", "serif"]';
  if (folder === "logo") return '["Georgia", "serif"]';
  if (folder === "handwriting") return '["Segoe Script", "Brush Script MT", "cursive"]';
  return '["system-ui", "arial"]';
}

/** Для заголовков используем только Cormorant, если он есть в папке (иначе первый файл). */
function pickHeadingFonts(files: string[]): string[] {
  const cormorant = files.find((f) => /cormorant/i.test(f));
  if (cormorant) return [cormorant];
  return files.length ? [files[0]] : [];
}

function findFonts(dir: string): string[] {
  try {
    const files = readdirSync(dir);
    const fontExtensions = [".ttf", ".otf", ".woff", ".woff2"];
    return files.filter((file) =>
      fontExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );
  } catch {
    return [];
  }
}

function getWeightFromFileName(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("thin") || lower.includes("100")) return "100";
  if (lower.includes("extralight") || lower.includes("200")) return "200";
  if (lower.includes("light") || lower.includes("300")) return "300";
  if (lower.includes("regular") || lower.includes("normal") || lower.includes("400")) return "400";
  if (lower.includes("medium") || lower.includes("500")) return "500";
  if (lower.includes("semibold") || lower.includes("600")) return "600";
  if (lower.includes("bold") || lower.includes("700")) return "700";
  if (lower.includes("extrabold") || lower.includes("800")) return "800";
  if (lower.includes("black") || lower.includes("900")) return "900";
  return "400";
}

function generateFontCode(fontFiles: string[], folder: string, varName: string): string {
  if (fontFiles.length === 0) {
    return `// Шрифт не найден в папке ${folder}`;
  }

  if (fontFiles.length === 1) {
    const file = fontFiles[0];
    const weight = getWeightFromFileName(file);
    return `localFont({
  src: "../public/fonts/${folder}/${file}",
  variable: "${varName}",
  display: "block",
  fallback: ${getFallback(folder)},
  weight: "${weight}",
})`;
  }

  // Несколько файлов - создаем массив
  const srcArray = fontFiles
    .map((file) => {
      const weight = getWeightFromFileName(file);
      return `    {
      path: "../public/fonts/${folder}/${file}",
      weight: "${weight}",
      style: "normal",
    }`;
    })
    .join(",\n");

  return `localFont({
  src: [
${srcArray}
  ],
  variable: "${varName}",
  display: "block",
  fallback: ${getFallback(folder)},
})`;
}

function generateFontsFile() {
  const headingFonts = pickHeadingFonts(findFonts(headingsDir));
  const bodyFonts = findFonts(bodyDir);
  const logoFonts = findFonts(logoDir);
  const handwritingFonts = findFonts(handwritingDir);

  const headingCode = generateFontCode(headingFonts, "headings", "--font-heading");
  const bodyCode = generateFontCode(bodyFonts, "body", "--font-body");
  const mainLogoFonts = logoFonts.filter(f => !f.toLowerCase().includes('script') && !f.toLowerCase().includes('theartist'));
  const subtitleLogoFonts = logoFonts.filter(f => f.toLowerCase().includes('script') || f.toLowerCase().includes('theartist'));

  // Рукописный шрифт — необязательный: без файла в папке экспорта просто нет.
  /* До 11.09.2026 у него стояло `preload: false` (52 КБ TTF не хотелось тянуть
     на страницах туров, где рукописи нет). В WOFF2 он весит 27 КБ, а без
     предзагрузки строка первого экрана появлялась с подменой шрифта, —
     предзагрузка теперь как у всех. */
  const handwritingBlock =
    handwritingFonts.length > 0
      ? [
          "",
          "// Рукописный акцент из public/fonts/handwriting/",
          `export const handwritingFont = ${generateFontCode(
            handwritingFonts,
            "handwriting",
            "--font-handwriting"
          )};`,
          "",
        ].join("\n")
      : ["", "// Рукописный шрифт не найден в папке handwriting", ""].join("\n");

  const logoCode =
    mainLogoFonts.length > 0
      ? generateFontCode(mainLogoFonts, "logo", "--font-logo")
      : `localFont({
  src: "../public/fonts/logo/LaLuxes-regular.woff2",
  variable: "--font-logo",
  display: "block",
  fallback: ["Georgia", "serif"],
  weight: "400",
})`;

  const subtitleLogoCode =
    subtitleLogoFonts.length > 0
      ? generateFontCode(subtitleLogoFonts, "logo", "--font-logo-subtitle")
      : `localFont({
  src: "../public/fonts/logo/MADE TheArtist Script PERSONAL USE.woff2",
  variable: "--font-logo-subtitle",
  display: "block",
  fallback: ["cursive"],
  weight: "400",
})`;

  const content = `import localFont from "next/font/local";

// Автоматически сгенерировано скриптом update-fonts.ts
// Для обновления запустите: npm run update-fonts

// Шрифт для заголовков из public/fonts/headings/
export const headingFont = ${headingCode};

// Шрифт для основного текста из public/fonts/body/
export const bodyFont = ${bodyCode};

// Логотип из public/fonts/logo/
export const logoFont = ${logoCode};

// Шрифт для подзаголовка логотипа
export const logoSubtitleFont = ${subtitleLogoCode};
${handwritingBlock}`;

  writeFileSync(outputFile, content, "utf-8");
  console.log("✅ Файл lib/fonts.ts успешно обновлен!");
  console.log(
    `   Заголовки: ${headingFonts.length > 0 ? headingFonts.join(", ") : "не найдено"}`
  );
  console.log(`   Основной текст: ${bodyFonts.length > 0 ? bodyFonts.join(", ") : "не найдено"}`);
  console.log(`   Логотип: ${logoFonts.length > 0 ? logoFonts.join(", ") : "не найдено"}`);
  console.log(
    `   Рукописный: ${handwritingFonts.length > 0 ? handwritingFonts.join(", ") : "не найдено"}`
  );
}

generateFontsFile();


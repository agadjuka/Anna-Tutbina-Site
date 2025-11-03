import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Автоматически обновляет lib/fonts.ts на основе шрифтов в папках
 * Запускайте этот скрипт после добавления новых шрифтов в папки
 */

const fontsDir = join(process.cwd(), "public", "fonts");
const headingsDir = join(fontsDir, "headings");
const bodyDir = join(fontsDir, "body");
const outputFile = join(process.cwd(), "lib", "fonts.ts");

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
  display: "swap",
  fallback: ${folder === "headings" ? '["serif"]' : '["system-ui", "arial"]'},
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
  display: "swap",
  fallback: ${folder === "headings" ? '["serif"]' : '["system-ui", "arial"]'},
})`;
}

function generateFontsFile() {
  const headingFonts = findFonts(headingsDir);
  const bodyFonts = findFonts(bodyDir);

  const headingCode = generateFontCode(headingFonts, "headings", "--font-heading");
  const bodyCode = generateFontCode(bodyFonts, "body", "--font-body");

  const content = `import localFont from "next/font/local";

// Автоматически сгенерировано скриптом update-fonts.ts
// Для обновления запустите: npm run update-fonts

// Шрифт для заголовков из public/fonts/headings/
export const headingFont = ${headingCode};

// Шрифт для основного текста из public/fonts/body/
export const bodyFont = ${bodyCode};
`;

  writeFileSync(outputFile, content, "utf-8");
  console.log("✅ Файл lib/fonts.ts успешно обновлен!");
  console.log(`   Заголовки: ${headingFonts.length > 0 ? headingFonts.join(", ") : "не найдено"}`);
  console.log(`   Основной текст: ${bodyFonts.length > 0 ? bodyFonts.join(", ") : "не найдено"}`);
}

generateFontsFile();


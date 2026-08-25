/**
 * АУДИТ УСТОЙЧИВОСТИ ВЁРСТКИ ГЛАВНОЙ ПРИ СМЕНЕ ШИРИНЫ ОКНА.
 *
 * Зачем. На главной действует «закон одного множителя»: каждый размер записан
 * как `calc(<число при 1280> * var(--ona-u))`. Пока это правило соблюдается,
 * страница на любой ширине — точная копия себя же, и число строк в тексте
 * измениться не может. Стоит где-то появиться своей формуле (`clamp(12px, …)`,
 * `max(11px, …)`, голый `lg:text-[17px]`, процент от контейнера) — кегль и
 * ширина колонки начинают меняться с разной скоростью, и перенос уезжает.
 * Скрипт ловит это автоматически.
 *
 * Как читать вывод:
 *   «ПЕРЕНОСЫ СЪЕЗЖАЮТ» — уже сломано, число строк отличается от эталонной
 *      ширины 1920. НОРМА — ПУСТОЙ СПИСОК.
 *   «КЕГЛЬ И КОЛОНКА МАСШТАБИРУЮТСЯ ПО-РАЗНОМУ» — ещё не сломано, но отношение
 *      «кегль / ширина колонки» плывёт: на другой ширине или при другом тексте
 *      из Sanity перенос съедет. Тоже норма — пустой список.
 *
 * Запуск (нужен playwright; в зависимости проекта он намеренно не добавлен):
 *   npm i -D playwright
 *   node scripts/audit-scale.mjs http://localhost:3000/admin/
 *
 * Префикс `/admin` обязателен — главная закрыта временными ограничениями
 * (см. docs/remove-restrictions.md).
 */
import { chromium } from 'playwright';

const REF = 1920;
const WIDTHS = [1024, 1280, 1366, 1440, 1600, 1920, 2560];

const url = process.argv[2] || 'http://localhost:3000/admin/';
const widths = process.argv.length > 3 ? process.argv.slice(3).map(Number) : WIDTHS;

const browser = await chromium.launch();
const byWidth = {};

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: 'light' });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  // прокручиваем страницу целиком, иначе ленивые картинки не отдадут настоящую высоту
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);

  byWidth[w] = await page.evaluate(() => {
    const sectionOf = (el) => {
      const s = el.closest('section[id], footer[id], header');
      return s ? s.id || s.tagName.toLowerCase() : 'other';
    };
    const out = [];
    const seen = {};
    document.querySelectorAll('main *, footer#contacts *, header *').forEach((el) => {
      // только настоящие текстовые листья: без блочных детей
      const hasBlockChild = [...el.children].some((c) => {
        const d = getComputedStyle(c).display;
        return d !== 'inline' && d !== 'inline-block' && c.tagName !== 'BR';
      });
      if (hasBlockChild) return;
      const txt = (el.innerText || '').trim();
      if (txt.length < 2) return;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const lines = Math.max(1, Math.round(r.height / lh));
      if (lines > 14) return; // это контейнер, а не строка текста
      const sec = sectionOf(el);
      const sig = `${sec}|${el.tagName.toLowerCase()}|${txt.slice(0, 28).replace(/\s+/g, ' ')}`;
      seen[sig] = (seen[sig] || 0) + 1;
      out.push({
        key: `${sig}#${seen[sig]}`,
        sec,
        txt: txt.slice(0, 40).replace(/\s+/g, ' '),
        fs: +parseFloat(cs.fontSize).toFixed(2),
        w: +r.width.toFixed(1),
        lines,
      });
    });
    return out;
  });

  await page.close();
  process.stderr.write(`снято ${w}\n`);
}

await browser.close();

const ref = new Map((byWidth[REF] || []).map((o) => [o.key, o]));
const problems = [];
for (const w of widths) {
  if (w === REF) continue;
  for (const o of byWidth[w]) {
    const r = ref.get(o.key);
    if (!r) continue;
    const fsRatio = o.fs / r.fs;
    const wRatio = o.w / r.w;
    const lineShift = o.lines !== r.lines;
    const mismatch = Math.abs(fsRatio - wRatio) > 0.06;
    if (lineShift || mismatch) {
      problems.push({
        w, sec: o.sec, txt: o.txt,
        lines: `${r.lines}→${o.lines}`,
        fsRatio: +fsRatio.toFixed(3),
        wRatio: +wRatio.toFixed(3),
        fs: `${r.fs}→${o.fs}`,
        boxW: `${Math.round(r.w)}→${Math.round(o.w)}`,
        lineShift,
      });
    }
  }
}

const grouped = new Map();
for (const p of problems) {
  const id = `${p.sec}|${p.txt}`;
  if (!grouped.has(id)) grouped.set(id, { ...p, widths: [] });
  const e = grouped.get(id);
  e.widths.push(p.w + (p.lineShift ? ` (строки ${p.lines})` : ''));
  if (p.lineShift) e.lineShift = true;
}
const list = [...grouped.values()];

console.log('\n===== ПЕРЕНОСЫ СЪЕЗЖАЮТ (число строк меняется) =====');
list.filter((e) => e.lineShift).forEach((e) =>
  console.log(` [${e.sec}] "${e.txt}"\n     ${e.widths.join(', ')} | кегль ${e.fs} (×${e.fsRatio}) | колонка ${e.boxW} (×${e.wRatio})`)
);
console.log('\n===== КЕГЛЬ И КОЛОНКА МАСШТАБИРУЮТСЯ ПО-РАЗНОМУ (перенос съедет) =====');
list.filter((e) => !e.lineShift).forEach((e) =>
  console.log(` [${e.sec}] "${e.txt}"\n     ${e.widths.join(', ')} | кегль ×${e.fsRatio} против колонки ×${e.wRatio}`)
);

const broken = list.filter((e) => e.lineShift).length;
console.log(`\nИтого: переносов съехало — ${broken}, расхождений пропорций — ${list.length - broken}.`);
process.exit(broken ? 1 : 0);

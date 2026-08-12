import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Превью концептов редизайна (песочница)",
  robots: { index: false, follow: false },
};

const LINKS = [
  {
    href: "/stitch-preview/hero",
    title: "HERO — мобильный",
    note: "2 концепта: полноэкранный иммерсивный (100svh) и редакторский сплит.",
  },
  {
    href: "/stitch-preview/values",
    title: "«Почему нас выбирают» — 6 пунктов",
    note: "2 концепта: тёмный нумерованный список и светлые строки с цифрой-подложкой.",
  },
];

export default function StitchPreviewIndex() {
  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-5 pb-24 pt-[100px]">
      <h1 className="font-heading text-[34px] leading-tight text-primary">
        Концепты редизайна — песочница
      </h1>
      <p className="mt-3 text-[15px] leading-[1.65] text-text-deep">
        Изолированные превью-страницы. Прод-секции (<code>components/sections/*</code>),
        общие стили и схемы Sanity не затронуты — весь код лежит в{" "}
        <code>components/stitch/</code>, тексты захардкожены.
      </p>

      {/* Честная пометка об авторстве — важна для приёмки */}
      <div className="mt-8 rounded-2xl border border-subtle-border bg-muted p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
          Об авторстве макетов
        </p>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-deep">
          Получить дизайн от Google Stitch <strong>не удалось</strong>: публичного API у
          Stitch нет, а ключ из <code>.env</code> оказался ключом Gemini API (формат{" "}
          <code>AQ.</code>), у которого в привязанном Google-проекте сам Gemini API
          отключён — запросы возвращают <code>403 SERVICE_DISABLED</code>.
        </p>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-deep">
          Поэтому концепты ниже — <strong>не вывод ИИ-сервиса</strong>, а моя собственная
          дизайн-работа по тем же брифам. Палитра и шрифты — строго существующие токены.
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-2xl border border-subtle-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h2 className="font-heading text-[22px] leading-tight text-primary">{l.title}</h2>
              <p className="mt-1 text-[14px] leading-[1.55] text-text-deep">{l.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

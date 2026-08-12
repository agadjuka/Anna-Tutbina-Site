import type { Metadata } from "next";
import Link from "next/link";
import { ValuesVariantA, ValuesVariantB } from "@/components/stitch/values-variants";

export const metadata: Metadata = {
  title: "Превью: VALUES (6 карточек) — концепты",
  robots: { index: false, follow: false },
};

function VariantLabel({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="border-y border-subtle-border bg-muted px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">{tag}</p>
      <h2 className="mt-1 font-heading text-[24px] leading-tight text-primary">{title}</h2>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.55] text-text-deep">{note}</p>
    </div>
  );
}

export default function ValuesPreviewPage() {
  return (
    <main className="bg-background">
      <div className="border-b border-subtle-border bg-background px-5 pb-6 pt-[92px]">
        <Link href="/stitch-preview" className="text-[13px] text-primary underline">
          ← ко всем концептам
        </Link>
        <h1 className="mt-3 font-heading text-[30px] leading-tight text-primary">
          «Почему нас выбирают» — концепты
        </h1>
        <p className="mt-2 max-w-[60ch] text-[14px] leading-[1.6] text-text-deep">
          Оба варианта убирают сетку 2×3 на мобильном: абзац получает полную ширину
          вместо 2–3 слов в строке. Десктоп — 2 и 3 колонки соответственно.
        </p>
      </div>

      <VariantLabel
        tag="Вариант A"
        title="Редакторский нумерованный список (тёмный)"
        note="Шесть белых плашек заменены сплошным списком строк с волосяными разделителями. Номер — крупная курсивная цифра Cormorant, приглушённая до фона; заголовок стоит с ней на одной базовой линии."
      />
      <ValuesVariantA />

      <VariantLabel
        tag="Вариант B"
        title="Светлые строки с цифрой-подложкой"
        note="Секция уходит на фон сайта, номер становится крупной «призрачной» цифрой, на которую слегка наезжает заголовок — приём журнальной вёрстки. Карточек нет вообще, ритм держат волосяные линии."
      />
      <ValuesVariantB />
    </main>
  );
}

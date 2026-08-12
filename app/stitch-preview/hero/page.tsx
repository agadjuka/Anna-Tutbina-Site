import type { Metadata } from "next";
import Link from "next/link";
import { HeroVariantA, HeroVariantB } from "@/components/stitch/hero-variants";

export const metadata: Metadata = {
  title: "Превью: HERO (мобильный) — концепты",
  robots: { index: false, follow: false },
};

/** Подпись над каждым вариантом. */
function VariantLabel({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="border-y border-subtle-border bg-muted px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">{tag}</p>
      <h2 className="mt-1 font-heading text-[24px] leading-tight text-primary">{title}</h2>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.55] text-text-deep">{note}</p>
    </div>
  );
}

export default function HeroPreviewPage() {
  return (
    <main className="bg-background">
      <div className="border-b border-subtle-border bg-background px-5 pb-6 pt-[92px]">
        <Link href="/stitch-preview" className="text-[13px] text-primary underline">
          ← ко всем концептам
        </Link>
        <h1 className="mt-3 font-heading text-[30px] leading-tight text-primary">
          HERO — мобильные концепты
        </h1>
        <p className="mt-2 max-w-[60ch] text-[14px] leading-[1.6] text-text-deep">
          Смотреть при ширине окна ~390px. Оба варианта решают одну задачу: текст
          больше не лежит на краях пяти кадров одновременно.
        </p>
      </div>

      <VariantLabel
        tag="Вариант A"
        title="Полноэкранный иммерсивный"
        note="Один вертикальный кадр на всю высоту экрана (100svh). Текст сидит в нижней трети на градиенте, который к низу доходит до чистого фона сайта. Кнопки — в зоне большого пальца."
      />
      <HeroVariantA />

      <VariantLabel
        tag="Вариант B"
        title="Редакторский сплит"
        note="Фото занимает верхние ~58% экрана и растворяется в фоне, текст живёт ниже на чистом фоне — нулевая конкуренция с картинкой. Узкая лента из трёх кадров сохраняет память о десктопном коллаже."
      />
      <HeroVariantB />
    </main>
  );
}

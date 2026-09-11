"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/sanity-image";
import { SocialIcon, SOCIAL_LABELS, isSocialPlatform } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";
import type { FounderPerson as FounderPersonData } from "@/lib/home-data";

/*
 * ДИПТИХ «СОЗДАТЕЛИ ПРОЕКТА» — с 11.09.2026 по макету заказчика от 07.09
 * (`docs/redesign/client-feedback-2026-09-11.md`, п. 1).
 *
 * Все размеры lg-ветки — в пикселях при ширине окна 1280, умноженных на
 * `--ona-u` (закон одного множителя, CLAUDE.md). Запасное `1px` — для страниц
 * без слоя масштаба (архивные версии v1–v6): там блок остаётся «как при 1280».
 *
 * КЕГЛИ — НЕ МАКЕТНЫЕ, А × 0.854. Макет заказчика (скриншот 143) нарисован в
 * старом масштабе Figma, до облегчения всей главной на 25.08; сайт по всем
 * блокам ровно 0.854 от этих макетов (замер: список GUESTS 12.9 против 15.1,
 * текст панели FOUNDERS 328 против 384 px на ту же строку). С макетными
 * кеглями блок выделялся на странице — «слишком крупно» (Илья 11.09).
 * Геометрия (фото 325×420, стык по центру, вертикальные отметки) — по макету.
 *
 * ПОВЕДЕНИЕ «ЧИТАТЬ ДАЛЬШЕ» (Илья, 11.09):
 * - раскрытая колонка уезжает вниз, закрытая остаётся на месте;
 * - если раскрыты ОБЕ — низ обеих (разделитель, кнопка, иконки) встаёт на
 *   один уровень, под более длинной;
 * - подпись под фото не двигается никогда — растут только боковые колонки.
 *
 * Выравнивание обеих раскрытых колонок нельзя сделать чистым CSS так, чтобы
 * оно ещё и ехало плавно: `align-self: stretch` включается скачком. Поэтому
 * естественная высота каждой раскрытой колонки меряется, и обеим ставится
 * общий `min-height` через переменную — а `min-height` анимируется тем же
 * переходом, что и сам текст.
 *
 * ⚠️ `prefers-reduced-motion`: высота и проявление текста анимируются и при
 * этой настройке (это спокойный переход по клику, без него колонка «прыгает»),
 * а сдвиг и расфокус текста — только без неё (`motion-safe:`).
 */


interface PersonProps {
  person: FounderPersonData;
  side: "left" | "right";
  open: boolean;
  onToggle: () => void;
  /** Общая высота колонок, когда раскрыты обе (px), иначе `undefined`. */
  sharedMin?: number;
  colRef: React.RefObject<HTMLDivElement | null>;
  topRef: React.RefObject<HTMLDivElement | null>;
  moreRef: React.RefObject<HTMLParagraphElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

function Person({ person, side, open, onToggle, sharedMin, colRef, topRef, moreRef, bottomRef }: PersonProps) {
  const moreId = useId();
  const hasMore = Boolean(person.descriptionMore?.trim());
  const socials = (person.socials ?? []).filter(
    (s): s is { platform: NonNullable<typeof s.platform>; url: string } =>
      isSocialPlatform(s.platform) && Boolean(s.url)
  );
  const isLeft = side === "left";

  return (
    /* На десктопе обёртка «растворяется» (`lg:contents`): фото и текст
       становятся ячейками общей сетки диптиха — текст / фото / фото / текст.
       На мобильном это обычная карточка: фото, под ним текст. Обе раскладки —
       из ОДНОЙ разметки, без дублирования текста. */
    <div className="flex flex-col items-center lg:contents">
      <div
        className={cn(
          "relative aspect-[325/420] w-full max-w-[340px] overflow-hidden lg:row-start-1 lg:aspect-auto lg:h-[calc(420*var(--ona-u,1px))] lg:max-w-none lg:self-start",
          isLeft ? "lg:col-start-2" : "lg:col-start-3"
        )}
      >
        {/* Прозрачность 85% («Фото 85% прозрачности») — на внутренней обёртке,
            а не на `img`: иначе общая анимация появления фото (`v6ImageIn`,
            opacity 0 → 1) в конце «щёлкала» бы с 1 на 0.85. `overflow-hidden`
            там же — для общего hover-zoom `.overflow-hidden > img`. */}
        <div className="absolute inset-0 overflow-hidden opacity-85">
          {person.photo?.asset ? (
            <SanityImage
              image={person.photo}
              fill
              aspectRatio={325 / 420}
              sizes="(max-width: 1023px) 340px, 26vw"
              quality={90}
              className="object-cover"
              alt={person.name ?? ""}
            />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
        </div>
      </div>

      {/* Текстовая колонка. Вертикаль при 1280 — по макету 143, от верха фото:
          имя +19, разделитель +262, низ контура иконок — на 25 выше низа фото.
          Ширина 184.5 = макетные 216 × 0.854: переносы строк как в макете. Свёрнутая колонка ровно
          высотой с фото (`min-h 420`), низ колонки прижат `mt-auto`. */}
      <div
        ref={colRef}
        style={sharedMin ? ({ "--founder-col-min": `${sharedMin}px` } as React.CSSProperties) : undefined}
        className={cn(
          "mt-6 flex w-full max-w-[340px] flex-col items-center text-center lg:row-start-1 lg:mt-0 lg:min-h-[var(--founder-col-min,calc(420*var(--ona-u,1px)))] lg:w-[calc(184.5*var(--ona-u,1px))] lg:max-w-none lg:self-start lg:pb-[calc(20.5*var(--ona-u,1px))] lg:pt-[calc(11*var(--ona-u,1px))] lg:transition-[min-height] lg:duration-[900ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
          isLeft
            ? "lg:col-start-1 lg:mr-[calc(36*var(--ona-u,1px))] lg:items-end lg:justify-self-end lg:text-right"
            : "lg:col-start-4 lg:ml-[calc(36*var(--ona-u,1px))] lg:items-start lg:justify-self-start lg:text-left"
        )}
      >
        <div ref={topRef} className="w-full">
          {person.name && (
            <h3 className="font-heading text-[28px] font-normal leading-[1.15] text-on-primary lg:text-[calc(27.8*var(--ona-u,1px))] lg:leading-[calc(32.5*var(--ona-u,1px))]">
              {person.name}
            </h3>
          )}
          {person.role && (
            <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.04em] text-subtle lg:mt-[calc(9.5*var(--ona-u,1px))] lg:text-[calc(12*var(--ona-u,1px))] lg:leading-[calc(15.4*var(--ona-u,1px))] lg:tracking-[0.03em]">
              {person.role}
            </p>
          )}
          {person.description && (
            <p className="mt-4 text-[15px] font-light leading-[1.55] text-background lg:mt-[calc(18*var(--ona-u,1px))] lg:text-[calc(14.9*var(--ona-u,1px))] lg:leading-[calc(20.7*var(--ona-u,1px))]">
              {person.description}
            </p>
          )}
        </div>

        {hasMore && (
          /* Высота — через `grid-template-rows: 0fr → 1fr`: без замеров в JS и
             без магического `max-height`. При раскрытии текст проявляется чуть
             позже начала роста высоты, при сворачивании сначала гаснет, потом
             схлопывается — в движении не видно «обрезанных» строк. Текст всё
             время в DOM (поиск, SEO), свёрнутым он скрыт от чтения. */
          <div
            id={moreId}
            aria-hidden={!open}
            className={cn(
              "grid w-full transition-[grid-template-rows]",
              open
                ? "grid-rows-[1fr] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "grid-rows-[0fr] delay-100 duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <p
                ref={moreRef}
                className={cn(
                  "pt-3 text-[15px] font-light leading-[1.55] text-background transition-[opacity,transform,filter] lg:pt-[calc(10*var(--ona-u,1px))] lg:text-[calc(14.9*var(--ona-u,1px))] lg:leading-[calc(20.7*var(--ona-u,1px))]",
                  open
                    ? "opacity-100 delay-200 duration-700 ease-out motion-safe:translate-y-0 motion-safe:blur-0"
                    : "opacity-0 duration-300 ease-in motion-safe:-translate-y-2 motion-safe:blur-[3px]"
                )}
              >
                {person.descriptionMore}
              </p>
            </div>
          </div>
        )}

        {/* Низ колонки: разделитель + «Читать дальше» + иконки, прижат к низу
            колонки (`mt-auto`). */}
        <div
          ref={bottomRef}
          className={cn(
            "mt-8 flex w-full flex-col items-center lg:mt-auto lg:pt-[calc(40*var(--ona-u,1px))]",
            isLeft ? "lg:items-end" : "lg:items-start"
          )}
        >
          {hasMore && (
            /* `data-no-lift` — без общего подъёма кнопок на 2px при наведении
               (`.v6-scene button:hover`): верхняя граница кнопки — линия-
               разделитель, она подпрыгивала бы вместе с текстом. */
            <button
              type="button"
              data-no-lift=""
              aria-expanded={open}
              aria-controls={moreId}
              onClick={onToggle}
              className="flex w-[160px] items-center justify-between border-t border-background/20 pt-4 text-[11px] font-medium uppercase tracking-[0.15em] text-background/70 transition-colors duration-300 hover:text-background lg:w-[calc(128*var(--ona-u,1px))] lg:pt-[calc(15.5*var(--ona-u,1px))] lg:text-[calc(9.5*var(--ona-u,1px))] lg:leading-[calc(12*var(--ona-u,1px))]"
            >
              <span>{open ? "Свернуть" : "Читать дальше"}</span>
              <svg
                viewBox="0 0 12 18"
                aria-hidden="true"
                className={cn(
                  "h-[18px] w-3 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-[calc(15.5*var(--ona-u,1px))] lg:w-[calc(10.5*var(--ona-u,1px))]",
                  open && "rotate-180"
                )}
              >
                <path d="M6 1v16M1 12 6 17l5-5" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {socials.length > 0 && (
            /* Иконки — как в макете: контур 24px (бокс 33, у SVG поля), шаг 55,
               группа отступает от края текста на 29 внутрь колонки. Ряд
               выровнен по левому краю группы — поэтому единственная иконка Ани
               стоит слева, на месте первой иконки группы (Илья 11.09). */
            <ul
              className={cn(
                "mt-8 flex items-center justify-center gap-6 lg:mt-[calc(68*var(--ona-u,1px))] lg:w-[calc(143*var(--ona-u,1px))] lg:justify-start lg:gap-[calc(22*var(--ona-u,1px))]",
                isLeft ? "lg:mr-[calc(29*var(--ona-u,1px))]" : "lg:ml-[calc(29*var(--ona-u,1px))]"
              )}
            >
              {socials.map((s) => (
                <li key={s.platform + s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SOCIAL_LABELS[s.platform]} — ${person.name ?? ""}`}
                    className="block text-background opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
                  >
                    <SocialIcon platform={s.platform} className="size-9 lg:size-[calc(33*var(--ona-u,1px))]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Естественная высота РАСКРЫТОЙ колонки: верх + весь текст продолжения + низ
 *  + паддинги. Продолжение меряется по самому абзацу — он и в свёрнутом виде
 *  сверстан во всю высоту, просто спрятан за `overflow-hidden`. */
function expandedHeight(
  col: HTMLDivElement | null,
  top: HTMLDivElement | null,
  more: HTMLParagraphElement | null,
  bottom: HTMLDivElement | null
) {
  if (!col || !top || !bottom) return 0;
  const cs = getComputedStyle(col);
  return (
    parseFloat(cs.paddingTop) +
    top.offsetHeight +
    (more?.offsetHeight ?? 0) +
    bottom.offsetHeight +
    parseFloat(cs.paddingBottom)
  );
}

export function FoundersDiptych({
  founderOne,
  founderTwo,
  caption,
}: {
  founderOne?: FounderPersonData;
  founderTwo?: FounderPersonData;
  caption?: string;
}) {
  const [open, setOpen] = useState({ left: false, right: false });
  const [sharedMin, setSharedMin] = useState<number | undefined>();

  const refs = {
    left: {
      col: useRef<HTMLDivElement>(null),
      top: useRef<HTMLDivElement>(null),
      more: useRef<HTMLParagraphElement>(null),
      bottom: useRef<HTMLDivElement>(null),
    },
    right: {
      col: useRef<HTMLDivElement>(null),
      top: useRef<HTMLDivElement>(null),
      more: useRef<HTMLParagraphElement>(null),
      bottom: useRef<HTMLDivElement>(null),
    },
  };
  const gridRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    if (!(open.left && open.right) || !window.matchMedia("(min-width: 1024px)").matches) {
      setSharedMin(undefined);
      return;
    }
    const l = refs.left;
    const r = refs.right;
    const h = Math.max(
      expandedHeight(l.col.current, l.top.current, l.more.current, l.bottom.current),
      expandedHeight(r.col.current, r.top.current, r.more.current, r.bottom.current)
    );
    setSharedMin(h > 0 ? Math.ceil(h) : undefined);
    // refs стабильны, пересчёт нужен только при смене состояния раскрытия
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open.left, open.right]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Ширина окна меняет переносы строк — пересчитываем общую высоту.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  return (
    /* `lg:min-h-[487]` + `content-start`: ряд сетки остаётся высотой с фото
       (420), под ним зарезервировано место под подпись (39 + две строки по
       14). Подпись — абсолютный слой на 459 от верха сетки, то есть ВСЕГДА
       прямо под фото: при раскрытии растут только боковые колонки. Когда
       раскрытая колонка длиннее 487, сетка растёт вместе с ней. */
    <div
      ref={gridRef}
      className="relative mt-10 flex flex-col items-center gap-14 lg:mt-[calc(54*var(--ona-u,1px))] lg:grid lg:min-h-[calc(487*var(--ona-u,1px))] lg:grid-cols-[1fr_calc(325*var(--ona-u,1px))_calc(325*var(--ona-u,1px))_1fr] lg:content-start lg:items-start lg:gap-0"
    >
      {founderOne?.name && (
        <Person
          person={founderOne}
          side="left"
          open={open.left}
          onToggle={() => setOpen((o) => ({ ...o, left: !o.left }))}
          sharedMin={sharedMin}
          colRef={refs.left.col}
          topRef={refs.left.top}
          moreRef={refs.left.more}
          bottomRef={refs.left.bottom}
        />
      )}
      {founderTwo?.name && (
        <Person
          person={founderTwo}
          side="right"
          open={open.right}
          onToggle={() => setOpen((o) => ({ ...o, right: !o.right }))}
          sharedMin={sharedMin}
          colRef={refs.right.col}
          topRef={refs.right.top}
          moreRef={refs.right.more}
          bottomRef={refs.right.bottom}
        />
      )}

      {/* Без `translate` для центрирования: у прямых детей этой сетки
          `transform` занят общей волной появления (`.v6-cine
          [class*="grid"] > *`), центруем через `mx-auto` + `inset-x-0`. */}
      {caption && (
        <p className="max-w-[320px] text-center text-[11px] font-medium uppercase leading-[1.6] tracking-[0.12em] text-background/75 lg:absolute lg:inset-x-0 lg:top-[calc(459*var(--ona-u,1px))] lg:mx-auto lg:w-[calc(360*var(--ona-u,1px))] lg:max-w-none lg:text-[calc(10*var(--ona-u,1px))] lg:leading-[calc(14*var(--ona-u,1px))]">
          {caption}
        </p>
      )}
    </div>
  );
}


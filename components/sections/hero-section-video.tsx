import { urlFor } from "@/lib/sanity.client";
import { HeroVideoMedia } from "@/components/sections/hero-video-media";
import type { HeroVideoContent } from "@/lib/home-data";

/**
 * ПЕРВЫЙ ЭКРАН С ВИДЕО — боевая главная с 2026-09-11 (`app/page.tsx`).
 *
 * Заменяет bento-коллаж из пяти фото (`hero-section-fullscreen-v4.tsx`) одним
 * фоновым роликом. Родился как версия 10 сравнения (`/admin/versions/v10`,
 * теперь в архиве) и стал боевым. Коллажный HERO не удалён — его по-прежнему
 * показывают архивные версии, и он возвращается одной строкой в `app/page.tsx`.
 *
 * ─── Где лежит видео ───────────────────────────────────────────────────────
 * Файлы статикой в `public/video/`, а не в Sanity: статика раздаётся с CDN
 * хостинга с иммутабельным кэшем и без лишнего round-trip к api.sanity.io за
 * ссылкой. Исходник заказчика (`IMG_3788.MOV`, 14.7 МБ, HEVC с айфона) для веба
 * непригоден — HEVC не играет ни Chrome, ни Firefox, — поэтому перекодировано в
 * H.264:
 *
 *   hero-wide.mp4    1920×1012, 3.4 МБ      — от 768px
 *   hero-narrow.mp4   720×720 (кроп 1:1), 0.8 МБ — телефон
 *
 * Оба без звуковой дорожки: со звуком браузер не даст автозапуск, а дорожка —
 * это лишний вес. Замена файла из Studio возможна (поля `video.file` /
 * `video.fileNarrow`), тогда ссылка приезжает с CDN Sanity.
 *
 * ─── ⚠️ Высота = высота видео, а не экрана ─────────────────────────────────
 * Правка Ильи 2026-09-07: «отходим от правила, что HERO на весь экран». Первая
 * редакция держала `100svh` и вписывала ролик внутрь — сверху и снизу оставались
 * широкие чёрные поля. Теперь высоту секции задаёт сам ролик: у контейнера
 * видео стоит `aspect-ratio` того файла, который приедет на этой ширине, а у
 * секции высоты нет. Кадр не растянут и не обрезан — коробка совпадает с
 * пропорцией файла, поэтому `object-fit: cover` ничего не режет. Следующая
 * секция при этом немного видна снизу — так и задумано.
 *
 * Раскладка одна на все экраны: видео во всю ширину, текст поверх кадра.
 * Различаются только пропорция файла и кегли — до 768px квадратный кроп,
 * дальше оригинальные 1920×1012. Почему на телефоне квадрат: ролик 1.9:1 во
 * всю ширину даёт на 390px полосу высотой 205px, тексту негде лечь; кропы
 * поуже (4:3, 4:5) дают больше высоты, но героини в кадре разводят руки, и на
 * части ролика кисти уезжали за край. Квадрат берёт 53% ширины исходника и
 * держит обе фигуры целиком все 32 секунды.
 *
 * ─── Размеры ───────────────────────────────────────────────────────────────
 * Вся типографика — `calc(N * var(--hero-u))`, где N — размер при опорной
 * ширине (1280 для широкого файла, 390 для квадратного). Замеры для десктопа
 * сняты с макета заказчика `Видео/образец текста на видео.png` (папка вне
 * сборки, в .gitignore) — это Retina-скриншот окна 1280, то есть все его
 * пиксели делятся на 2. Потолка 1.5px у множителя тут нет, в отличие от
 * `--ona-u` страницы: текст скомпонован НА кадре, а кадр растёт вместе с
 * шириной окна. Сам слой — секция «Видео-HERO» в `globals.css`.
 */

const FALLBACK = {
  eyebrow: "wellness lifestyle · комьюнити · путешествия через состояния",
  heading: "Больше, чем путешествия",
  handwritten: "для женщин, которые выбирают\nне просто отдых, а состояние",
  wideSrc: "/video/hero-wide.mp4",
  narrowSrc: "/video/hero-narrow.mp4",
  widePoster: "/video/hero-poster.jpg",
  narrowPoster: "/video/hero-poster-narrow.jpg",
} as const;

/** Тот же приём, что и у коллажного HERO: секция поднимается под липкую шапку,
 *  чтобы честно занять весь первый экран (разбор — в `hero-section-fullscreen-v4.tsx`). */
const PULL_UNDER_HEADER = "calc(-1 * var(--header-height, 64px))";

export function HeroSectionVideo({ video }: { video?: HeroVideoContent | null }) {
  const eyebrow = video?.eyebrow || FALLBACK.eyebrow;
  const heading = video?.heading || FALLBACK.heading;
  const handwritten = video?.handwritten || FALLBACK.handwritten;

  const wideSrc = video?.file?.asset?.url || FALLBACK.wideSrc;
  /* Узкий файл отдельно не загружали — значит на телефоне играет тот же
     широкий: лучше лишние килобайты, чем пустое место вместо видео. */
  const narrowSrc = video?.fileNarrow?.asset?.url || (video?.file?.asset?.url ? wideSrc : FALLBACK.narrowSrc);

  const poster = video?.poster?.asset ? urlFor(video.poster).width(1280).quality(70).url() : null;
  const widePoster = poster || FALLBACK.widePoster;
  const narrowPoster = poster || FALLBACK.narrowPoster;

  return (
    /* `data-hero-fullscreen` тут намеренно НЕТ, в отличие от коллажного HERO:
       этот первый экран не полноэкранный (см. ниже). Атрибут сейчас ничего не
       включает — только помечает «полноэкранный HERO» для стилей и отладки, —
       и ставить его здесь значило бы врать. */
    <section id="hero" data-hero-video style={{ marginTop: PULL_UNDER_HEADER }}>
      <div className="hero-video__media">
        <HeroVideoMedia
          wideSrc={wideSrc}
          narrowSrc={narrowSrc}
          widePoster={widePoster}
          narrowPoster={narrowPoster}
        />
      </div>

      <div className="hero-video__scrim" aria-hidden="true" />

      <div className="hero-video__text">
        {eyebrow && <p className="hero-video__eyebrow hero-fade-up">{eyebrow}</p>}

        {heading && (
          <h1 className="hero-video__heading hero-fade-up" style={{ animationDelay: "120ms" }}>
            {heading}
          </h1>
        )}

        {handwritten && (
          /* `white-space: pre-line` в CSS: перенос строки в поле Sanity = перенос
             строки на сайте. В макете рукописная подпись именно в две строки, и
             делить её на два поля ради этого не хочется. */
          <p className="hero-video__hand hero-fade-up" style={{ animationDelay: "260ms" }}>
            {handwritten}
          </p>
        )}
      </div>

      {/* Маркер прокрутки — та же анимированная полоска, что и у коллажного
          HERO (заказчик просил оставить его как есть). `hero-video__cue`
          пришивает её к нижней кромке КАДРА: экран HERO больше не занимает,
          и прежняя привязка к низу экрана оставила бы полоску болтаться
          посреди следующей секции. */}
      <div className="hero-scroll-cue hero-video__cue pointer-events-none" aria-hidden="true" />
    </section>
  );
}

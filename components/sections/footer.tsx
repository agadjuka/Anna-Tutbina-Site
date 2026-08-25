import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SmartLink } from "@/components/ui/smart-link";
import { getSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

interface FooterLink {
  label?: string;
  url?: string;
}

/** Три слова дыхательного цикла из макета (`5:17`/`5:18`/`5:19`) — в Figma это
 * кадры прототипа (opacity 0), на сайте — бесконечный CSS-цикл, см. globals.css. */
/* Кегль в px — как в макете при 1920. Сам круг масштабируется
 * (`min(17.7vw,340px)`), поэтому слова внутри тоже переводятся в пропорцию
 * при рендере ниже — иначе на узком экране они торчали из круга. */
const BREATH_WORDS: { word: string; size: number }[] = [
  { word: "вдох", size: 17 },
  { word: "пауза", size: 23 },
  { word: "выдох", size: 23 },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (!link.label) return null;

  const className =
    "text-[14.5px] text-background transition-opacity duration-300 hover:opacity-70 lg:text-[clamp(11px,0.755vw,14.5px)]";

  if (!link.url) {
    // Пункт заведён (например, ждёт реальной ссылки от заказчика) — показываем как текст, не как мёртвую ссылку.
    return <span className={cn(className, "opacity-60")}>{link.label}</span>;
  }

  const isExternal = /^https?:\/\//.test(link.url);
  return (
    <SmartLink
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={className}
    >
      {link.label}
    </SmartLink>
  );
}

/** Декоративные концентрические кольца с циклом «вдох · пауза · выдох» (`5:14`–`5:19`).
 * Только десктоп — на мобильном места под чисто декоративный элемент нет, тот же
 * принцип, что и с коллажем GUESTS/фото-кластерами HERO (см. docs/redesign).
 *
 * Кольца-«вода»: контур колец пропущен через SVG-фильтр (feTurbulence +
 * feDisplacementMap) — в покое лёгкое переливание (SMIL `<animate>` зациклен
 * прямо в фильтре, без JS), при наведении на блок CSS переключает фильтр на
 * более сильный/быстрый вариант — рябь читается как «потревоженная вода».
 * Центральный круг и слова — вне фильтра, текст должен читаться чётко.
 * Эффект общий для всех версий сайта (компонент не привязан к v1/v2/v3…). */
function BreathingCircles() {
  return (
    <div
      className="footer-water-wrap relative hidden h-[min(17.7vw,340px)] w-[min(17.7vw,340px)] shrink-0 items-center justify-center lg:flex"
      aria-hidden="true"
    >
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          {/* v2 фильтра: прошлая версия (baseFrequency/scale слишком высокие) на тонких
              обводках колец давала не рябь, а рваные зигзаги — параметры уменьшены
              на порядок и добавлено лёгкое размытие после смещения, чтобы контур
              оставался мягким, "нежным", а не ломаным. */}
          <filter id="onaWaterIdle" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="1" seed="7" result="n">
              <animate attributeName="baseFrequency" dur="22s" values="0.005 0.008;0.008 0.011;0.005 0.008" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="0.35" />
          </filter>
          <filter id="onaWaterActive" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.017" numOctaves="2" seed="7" result="n2">
              <animate attributeName="baseFrequency" dur="3.2s" values="0.01 0.015;0.017 0.023;0.01 0.015" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n2" scale="6.5" xChannelSelector="R" yChannelSelector="G" result="d2" />
            <feGaussianBlur in="d2" stdDeviation="0.3" />
          </filter>
        </defs>
      </svg>

      {/* Волны — расходятся от края центрального круга наружу, зациклены со сдвигом фазы.
          Цвет — светлый `background`, а не `primary`: футер залит `primary-dark`, и кольца
          цветом `primary` на нём практически не читались (разница ~15 единиц яркости). */}
      <div className="footer-water-target absolute inset-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="footer-breathe-ripple absolute inset-[25%] rounded-full border-[1.5px] border-background/45"
            style={{ animationDelay: `${i * 2}s` }}
          />
        ))}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-background/20" />
        <div className="absolute inset-[13%] rounded-full border-[1.5px] border-background/30" />
      </div>

      <div className="footer-breathe-circle absolute inset-[25%] rounded-full border border-primary bg-background opacity-90" />
      <div className="relative flex h-[50%] w-[50%] items-center justify-center">
        {BREATH_WORDS.map(({ word, size }, i) => (
          <span
            key={word}
            className="footer-breathe-word absolute font-heading italic leading-none text-text-deep"
            style={{ fontSize: `min(${((size / 1920) * 100).toFixed(3)}vw, ${size}px)`, animationDelay: `${-i * 3}s` }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function Footer() {
  noStore();
  /* Общий на весь рендер источник настроек — тот же запрос нужен плавающей
     кнопке контактов и `getHomeData()`, раньше он уходил в Sanity трижды.
     См. `lib/site-settings.ts`. */
  const settings = await getSiteSettings();

  const contactLinks = settings?.contactLinks ?? [];
  const communityLinks = settings?.communityLinks ?? [];

  return (
    <footer id="contacts" className="relative w-full overflow-hidden bg-primary-dark">
      {/* Кольца в макете (`5:14`…`5:16`) стоят ПРАВЕЕ контентной колонки:
          340×340 на x=1523…1863, y=31 — то есть в правом поле, а не четвёртой
          колонкой ряда. Поэтому они вынесены из сетки в абсолютный слой. */}
      <div className="pointer-events-none absolute right-[3%] top-[7.1%] hidden lg:block">
        <div className="pointer-events-auto">
          <BreathingCircles />
        </div>
      </div>

      <Container className="lg:max-w-[min(56.9vw,1092px)] lg:px-0">
        {/* `lg:items-center`, а не `items-start`: круги-«вода» намного выше
            остальных колонок (логотип, «Связаться», «Сообщество»), и при
            выравнивании по верху те повисали у самого верха высокого ряда с
            большим пустым пространством под ними — визуально несбалансированно.
            По центру ряда все четыре колонки читаются как единая строка. */}
        {/* Высота футера в макете (`5:286`) — 436.63 при 1920: логотип на y=148,
            нижняя полоса на y=352. Колонки: логотип x=414, «Связаться» x=834.5,
            «Сообщество» x=1192.25 — то есть контент 1092px по центру. Кольца
            в макете вынесены правее контента (x 1523…1863), у нас они остаются
            четвёртой колонкой ряда: перенос их за пределы контейнера ломает
            выравнивание всего ряда, а выигрыш чисто декоративный. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[min(21.9vw,420px)_min(18.6vw,358px)_1fr] lg:items-start lg:gap-x-0 lg:pb-[min(4.06vw,78px)] lg:pt-[min(7.7vw,148px)]">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-logo text-[32px] leading-none text-background lg:text-[min(1.67vw,32px)]">ONÁ</span>
            {settings?.slogan && (
              <p className="mt-4 max-w-[300px] font-heading text-[16.5px] italic leading-[1.55] text-subtle-border lg:mt-[min(0.83vw,16px)] lg:max-w-[min(15.63vw,300px)] lg:text-[clamp(11px,0.86vw,16.5px)]">
                {settings.slogan}
              </p>
            )}
          </div>

          {contactLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle lg:text-[clamp(9px,0.573vw,11px)]">Связаться</p>
              <div className="mt-5 flex flex-col gap-3 lg:mt-[min(1.04vw,20px)] lg:gap-[min(0.63vw,12px)]">
                {contactLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          {communityLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle lg:text-[clamp(9px,0.573vw,11px)]">Сообщество</p>
              <div className="mt-5 flex flex-col gap-3 lg:mt-[min(1.04vw,20px)] lg:gap-[min(0.63vw,12px)]">
                {communityLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

        </div>
      </Container>

      <div className="border-t border-background/15">
        <Container className="lg:max-w-[min(56.9vw,1092px)] lg:px-0">
          {/* От `sm` — не сетка, а `flex justify-between`. При равных третях
              (`grid-cols-3`) центральная подпись разработчика шире остальных
              и отбирала место у правой заметки: та переносилась на две строки,
              и ряд читался косо. Колонки по содержимому раздвигаются по краям
              полосы, и переносить нечего — проверено вплоть до 1024. */}
          <div className="grid grid-cols-1 items-center gap-3 py-6 text-center text-[11px] uppercase tracking-[0.06em] text-subtle sm:flex sm:items-center sm:justify-between sm:gap-4 sm:text-left lg:pb-[min(2.1vw,40px)] lg:pt-[min(1.3vw,25px)] lg:text-[clamp(9px,0.573vw,11px)]">
            <span className="shrink-0">© ONÁ · {new Date().getFullYear()}</span>
            {/* Такой же яркий и кликабельный, как ссылки «Связаться» выше — не мелкая бледная подпись */}
            <Link
              href="https://t.me/markov1u"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[14.5px] font-normal normal-case tracking-normal text-background transition-opacity duration-300 hover:opacity-70 lg:text-[clamp(11px,0.755vw,14.5px)]"
            >
              Разработка сайта · @markov1u
            </Link>
            {settings?.footerNote && (
              <span className="shrink-0 sm:text-right">{settings.footerNote}</span>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}

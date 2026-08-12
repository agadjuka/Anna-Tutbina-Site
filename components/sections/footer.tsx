import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SmartLink } from "@/components/ui/smart-link";
import { sanityClient } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import { cn } from "@/lib/utils";

interface FooterLink {
  label?: string;
  url?: string;
}

interface SiteSettings {
  slogan?: string;
  contactLinks?: FooterLink[];
  communityLinks?: FooterLink[];
  footerNote?: string;
}

/** Три слова дыхательного цикла из макета (`5:17`/`5:18`/`5:19`) — в Figma это
 * кадры прототипа (opacity 0), на сайте — бесконечный CSS-цикл, см. globals.css. */
const BREATH_WORDS: { word: string; size: number }[] = [
  { word: "вдох", size: 17 },
  { word: "пауза", size: 23 },
  { word: "выдох", size: 23 },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (!link.label) return null;

  const className = "text-[14.5px] text-background transition-opacity duration-300 hover:opacity-70";

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
 * принцип, что и с коллажем GUESTS/фото-кластерами HERO (см. docs/redesign). */
function BreathingCircles() {
  return (
    <div
      className="relative hidden h-[240px] w-[240px] shrink-0 items-center justify-center lg:flex xl:h-[300px] xl:w-[300px]"
      aria-hidden="true"
    >
      {/* Волны — расходятся от края центрального круга наружу, зациклены со сдвигом фазы.
          Цвет — светлый `background`, а не `primary`: футер залит `primary-dark`, и кольца
          цветом `primary` на нём практически не читались (разница ~15 единиц яркости). */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="footer-breathe-ripple absolute inset-[25%] rounded-full border border-background/45"
          style={{ animationDelay: `${i * 2}s` }}
        />
      ))}
      <div className="absolute inset-0 rounded-full border border-background/20" />
      <div className="absolute inset-[13%] rounded-full border border-background/30" />
      <div className="footer-breathe-circle absolute inset-[25%] rounded-full border border-primary bg-background opacity-90" />
      <div className="relative flex h-[50%] w-[50%] items-center justify-center">
        {BREATH_WORDS.map(({ word, size }, i) => (
          <span
            key={word}
            className="footer-breathe-word absolute font-heading italic leading-none text-text-deep"
            style={{ fontSize: size, animationDelay: `${-i * 3}s` }}
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
  const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);

  const contactLinks = settings?.contactLinks ?? [];
  const communityLinks = settings?.communityLinks ?? [];

  return (
    <footer id="contacts" className="relative w-full overflow-hidden bg-primary-dark">
      <Container>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,280px)_1fr_1fr_auto] lg:items-start lg:gap-x-16 lg:py-20">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-logo text-[32px] leading-none text-background">ONÁ</span>
            {settings?.slogan && (
              <p className="mt-4 max-w-[300px] font-heading text-[16.5px] italic leading-[1.55] text-subtle-border">
                {settings.slogan}
              </p>
            )}
          </div>

          {contactLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle">Связаться</p>
              <div className="mt-5 flex flex-col gap-3">
                {contactLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          {communityLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle">Сообщество</p>
              <div className="mt-5 flex flex-col gap-3">
                {communityLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          <div className="hidden justify-self-end lg:flex">
            <BreathingCircles />
          </div>
        </div>
      </Container>

      <div className="border-t border-background/15">
        <Container>
          <div className="grid grid-cols-1 items-center gap-3 py-6 text-center text-[11px] uppercase tracking-[0.06em] text-subtle sm:grid-cols-3 sm:gap-4 sm:text-left">
            <span className="sm:col-start-1 sm:justify-self-start">© ONÁ · {new Date().getFullYear()}</span>
            {/* Такой же яркий и кликабельный, как ссылки «Связаться» выше — не мелкая бледная подпись */}
            <Link
              href="https://t.me/markov1u"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14.5px] font-normal normal-case tracking-normal text-background transition-opacity duration-300 hover:opacity-70 sm:col-start-2 sm:justify-self-center"
            >
              Разработка сайта · @markov1u
            </Link>
            {settings?.footerNote && (
              <span className="sm:col-start-3 sm:justify-self-end">{settings.footerNote}</span>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}

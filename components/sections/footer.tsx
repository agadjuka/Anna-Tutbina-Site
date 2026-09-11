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

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (!link.label) return null;

  const className =
    "text-[14.5px] text-background transition-opacity duration-300 hover:opacity-70 lg:text-[calc(10*var(--ona-u))]";

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
      <Container className="lg:w-[calc(728*var(--ona-u))] lg:pb-[calc(28.58*var(--ona-u))] lg:pt-[calc(54.21*var(--ona-u))]">
        {/* Высота футера в макете (`5:286`) — 436.63 при 1920: логотип на y=148,
            нижняя полоса на y=352. Колонки: логотип x=414, «Связаться» x=834.5,
            «Сообщество» x=1192.25 — то есть контент 1092px по центру.
            Декоративные кольца «вдох · пауза · выдох» справа от колонок (`5:14`…
            `5:19`) убраны по просьбе заказчика 08.09
            (`docs/redesign/client-feedback-2026-09-11.md`, п. 5). */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[min(21.9vw,420px)_min(18.6vw,358px)_1fr] lg:items-start lg:gap-x-0 lg:pb-[min(4.06vw,78px)] lg:pt-[calc(48*var(--ona-u))]">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-logo text-[32px] leading-none text-background lg:text-[min(1.67vw,32px)]">ONÁ</span>
            {settings?.slogan && (
              <p className="mt-4 max-w-[300px] font-heading text-[16.5px] italic leading-[1.55] text-subtle-border lg:mt-[calc(5.84*var(--ona-u))] lg:max-w-[min(15.63vw,300px)] lg:text-[calc(11*var(--ona-u))]">
                {settings.slogan}
              </p>
            )}
          </div>

          {contactLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle lg:text-[calc(9*var(--ona-u))]">Связаться</p>
              <div className="mt-5 flex flex-col gap-3 lg:mt-[calc(7.32*var(--ona-u))] lg:gap-[calc(4.44*var(--ona-u))]">
                {contactLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          {communityLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-subtle lg:text-[calc(9*var(--ona-u))]">Сообщество</p>
              <div className="mt-5 flex flex-col gap-3 lg:mt-[calc(7.32*var(--ona-u))] lg:gap-[calc(4.44*var(--ona-u))]">
                {communityLinks.map((link, i) => (
                  <FooterLinkItem key={i} link={link} />
                ))}
              </div>
            </div>
          )}

        </div>
      </Container>

      <div className="border-t border-background/15 lg:pb-[calc(14.78*var(--ona-u))] lg:pt-[calc(9.15*var(--ona-u))]">
        <Container className="lg:w-[calc(728*var(--ona-u))] lg:text-[calc(9*var(--ona-u))]">
          {/* От `sm` — не сетка, а `flex justify-between`. При равных третях
              (`grid-cols-3`) центральная подпись разработчика шире остальных
              и отбирала место у правой заметки: та переносилась на две строки,
              и ряд читался косо. Колонки по содержимому раздвигаются по краям
              полосы, и переносить нечего — проверено вплоть до 1024. */}
          <div className="grid grid-cols-1 items-center gap-3 py-6 text-center text-[11px] uppercase tracking-[0.06em] text-subtle sm:flex sm:items-center sm:justify-between sm:gap-4 sm:text-left lg:pb-[min(2.1vw,40px)] lg:pt-[min(1.3vw,25px)] lg:text-[clamp(9px,0.573vw,11px)] lg:[&>span]:text-[calc(9*var(--ona-u))]">
            <span className="shrink-0">© ONÁ · {new Date().getFullYear()}</span>
            {/* Такой же яркий и кликабельный, как ссылки «Связаться» выше — не мелкая бледная подпись */}
            <Link
              href="https://t.me/markov1u"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[14.5px] font-normal normal-case tracking-normal text-background transition-opacity duration-300 hover:opacity-70 lg:text-[calc(10*var(--ona-u))]"
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

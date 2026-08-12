import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";

interface GuestsContent {
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  items?: string[];
  body?: any;
  photos?: any[];
}

interface GuestsSectionProps {
  guests?: GuestsContent | null;
}

/** Коллаж из макета (ноды 5:205, 53:227, 53:209): три фото с «лепестковыми» скруглениями.
 * Углы в Figma заданы в px и на разных по размеру фото дают разную форму — переведены
 * в проценты от сторон, чтобы форма сохранялась на любой ширине экрана.
 * Позиции — доли от бокса коллажа (x 954…1770, y 184…894 в координатах макета). */
const PHOTOS = [
  {
    aspectRatio: 780 / 382,
    box: "left-0 top-0 w-[95.6%] h-[53.8%]",
    radius: "37.7% 15.9% 33.9% 19.7% / 77% 32.5% 69.2% 40.3%",
  },
  {
    aspectRatio: 420 / 273,
    box: "left-[6.5%] top-[59.6%] w-[51.5%] h-[38.5%]",
    radius: "70% 29.5% 62.9% 36.6% / 107.7% 45.5% 96.8% 56.4%",
  },
  {
    aspectRatio: 325 / 433,
    box: "left-[60.2%] top-[39%] w-[39.8%] h-[61%]",
    radius: "71.2% 25.8% 72.4% 24.5% / 53.4% 19.3% 54.4% 18.4%",
  },
] as const;

export function GuestsSection({ guests }: GuestsSectionProps) {
  if (!guests) return null;

  const photos = guests.photos ?? [];
  const items = guests.items ?? [];

  return (
    <section id="guests" className="relative bg-background py-16 lg:py-24">
      <Container>
        {guests.eyebrow && (
          <p className="text-center text-[13px] font-medium uppercase tracking-[0.18em] text-subtle sm:text-[15px]">
            {guests.eyebrow}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:flex-row lg:items-stretch lg:gap-[5%]">
          <div className="lg:w-[45%]">
            {(guests.heading || guests.headingAccent) && (
              <h2 className="font-heading text-[32px] leading-tight text-foreground sm:text-[40px] lg:text-[clamp(40px,2.76vw,53px)]">
                {guests.heading}{" "}
                {guests.headingAccent && (
                  <span className="italic text-primary">{guests.headingAccent}</span>
                )}
              </h2>
            )}

            {items.length > 0 && (
              <ul className="mt-8 space-y-5 lg:mt-10 lg:space-y-[clamp(20px,2.4vw,46px)]">
                {items.map((item, index) => (
                  <li key={index} className="flex items-baseline gap-4 lg:gap-[clamp(16px,2.5vw,48px)]">
                    <span aria-hidden="true" className="text-[16px] text-primary lg:text-[clamp(16px,1vw,19px)]">
                      ✦
                    </span>
                    <span className="text-[17px] leading-snug text-foreground sm:text-[20px] lg:text-[clamp(20px,1.3vw,25px)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {guests.body && (
              <PortableTextContent
                value={guests.body}
                className="mt-10 space-y-6 text-[17px] leading-[1.45] text-foreground sm:text-[20px] lg:mt-12 lg:text-[clamp(20px,1.3vw,25px)] [&_em]:font-heading [&_em]:text-[1.6em] [&_em]:leading-[1]"
              />
            )}
          </div>

          {photos.length > 0 && (
            <div className="lg:w-[50%]">
              {/* Десктоп: коллаж с перекрытием, как в макете. Высота — не жёсткий
                  aspect-ratio, а h-full от растянутой (items-stretch) строки: коллаж
                  подстраивается под высоту текстовой колонки, не остаётся мелким
                  островком, когда список+абзацы длиннее своей "естественной" высоты. */}
              <div className="relative hidden min-h-[500px] w-full lg:block lg:h-full">
                {photos.slice(0, PHOTOS.length).map((photo, index) => (
                  <div
                    key={index}
                    className={`absolute overflow-hidden ${PHOTOS[index].box}`}
                    style={{ borderRadius: PHOTOS[index].radius }}
                  >
                    <SanityImage
                      image={photo}
                      fill
                      aspectRatio={PHOTOS[index].aspectRatio}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Мобильная/планшетная: те же формы, но простой сеткой без перекрытий */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {photos.slice(0, PHOTOS.length).map((photo, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden ${index === 0 ? "col-span-2 aspect-[780/382]" : "aspect-[4/5]"}`}
                    style={{ borderRadius: PHOTOS[index].radius }}
                  >
                    <SanityImage
                      image={photo}
                      fill
                      aspectRatio={index === 0 ? PHOTOS[0].aspectRatio : 4 / 5}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

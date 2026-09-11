import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/utils";

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

/**
 * Коллаж — «классический», прямоугольный (заказчик 08.09, вместо трёх фото-
 * «лепестков»; `docs/redesign/client-feedback-2026-09-11.md`, п. 2).
 *
 * Занимает всю правую половину секции — от центра страницы до правого края
 * окна и от верхней до нижней кромки блока. Плитки вплотную, без зазоров и
 * скруглений: сверху широкое групповое фото, снизу два рядом. Доли сняты с
 * макета заказчика при 1280: верхнее фото — 53% высоты, нижнее левое — 57%
 * ширины.
 *
 * Пропорции — КАК В МАКЕТЕ, а не «как получится от текста»: высота секции
 * при 1280 зафиксирована на 592 (`globals.css`, раздел GUESTS) — это 577 из
 * макета, пересчитанные на нашу половину 640 вместо макетных 624. Только при
 * этой высоте плитки имеют макетные пропорции (яхта 2.04, йога 1.31, пляж
 * 0.99), и кадр совпадает с макетом один в один. Сами кадры (центры) заданы
 * hotspot'ами в Studio — сняты сопоставлением плиток макета с исходниками.
 *
 * `aspectRatio` у каждой плитки — её пропорция при 1280. Благодаря закону
 * одного множителя та же пропорция держится на любой ширине `lg`, а
 * мобильный коллаж набран с тем же соотношением сторон — поэтому сервер
 * Sanity режет исходник ровно под рамку, и двойного кропа нет.
 */
const COLLAGE_H = 592;
const COLLAGE_ASPECT = 640 / COLLAGE_H;
const TILES = [
  {
    area: "col-span-2",
    aspectRatio: 640 / (COLLAGE_H * 0.53),
    sizes: "(max-width: 1023px) 100vw, 50vw",
  },
  {
    area: "",
    aspectRatio: (640 * 0.57) / (COLLAGE_H * 0.47),
    sizes: "(max-width: 1023px) 57vw, 29vw",
  },
  {
    area: "",
    aspectRatio: (640 * 0.43) / (COLLAGE_H * 0.47),
    sizes: "(max-width: 1023px) 43vw, 22vw",
  },
] as const;

function Collage({
  photos,
  className,
  style,
}: {
  photos: any[];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    /* Сетка 57/43 × 53/47. Имя класса содержит «grid» — значит, плитки получают
       общую волну появления `.v6-cine … [class*="grid"] > *` (по очереди), это
       задумано. Поэтому прозрачность 90% стоит НЕ на самой плитке (её `opacity`
       анимирует волна — в конце был бы скачок 1 → 0.9), а на внутренней
       обёртке. Там же `overflow-hidden`: общий hover-zoom `.overflow-hidden > img`
       продолжает работать. */
    <div
      className={cn("grid grid-cols-[57fr_43fr] grid-rows-[53fr_47fr]", className)}
      style={style}
    >
      {photos.slice(0, TILES.length).map((photo, index) => (
        <div key={index} className={cn("relative min-h-0 min-w-0", TILES[index].area)}>
          <div className="absolute inset-0 overflow-hidden opacity-90">
            <SanityImage
              image={photo}
              fill
              aspectRatio={TILES[index].aspectRatio}
              sizes={TILES[index].sizes}
              quality={90}
              alt=""
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GuestsSection({ guests }: GuestsSectionProps) {
  if (!guests) return null;

  const photos = guests.photos ?? [];
  const items = guests.items ?? [];

  return (
    /* Текстовая колонка снята с узлов Figma (секция `5:189`): эйбрау, заголовок
       (курсив — primary), пункты списка с ✦, абзацы с выделением Cormorant.
       Размеры на главной задаёт слой масштаба в `globals.css` (раздел GUESTS).

       Раскладка с 11.09.2026: текст — в левой половине (левый край = край общего
       контейнера страницы), коллаж — абсолютным слоем в правой половине,
       ровно от центра страницы. Стык стоит на той же вертикали, что и стык
       водопад/панель в FOUNDERS ниже — заказчик провёл по ней красную линию. */
    <section id="guests" className="relative bg-background pt-16 lg:py-0">
      <Container size="wide">
        <div className="lg:w-[calc(526.5*var(--ona-u,1px))]">
          {guests.eyebrow && (
            <SectionEyebrow className="text-center text-subtle lg:text-left">
              {guests.eyebrow}
            </SectionEyebrow>
          )}

          <div className="mt-10 lg:mt-[min(1.46vw,28px)]">
            {(guests.heading || guests.headingAccent) && (
              <h2 className="font-heading text-[32px] leading-tight text-foreground sm:text-[33px] lg:text-[min(2.76vw,53px)] lg:leading-[min(3.07vw,59px)]">
                {guests.heading}{" "}
                {guests.headingAccent && (
                  <span className="italic text-primary">{guests.headingAccent}</span>
                )}
              </h2>
            )}

            {items.length > 0 && (
              <ul className="mt-8 space-y-5 lg:mt-[min(1.98vw,38px)] lg:space-y-[min(2.57vw,49px)]">
                {items.map((item, index) => (
                  <li key={index} className="flex items-baseline gap-4 lg:items-center lg:gap-[min(1.86vw,36px)]">
                    <span aria-hidden="true" className="text-[16px] leading-[26px] text-primary lg:text-[clamp(12px,1vw,19px)] lg:leading-[26.25px]">
                      ✦
                    </span>
                    <span className="text-[17px] leading-snug text-foreground sm:text-[20px] lg:text-[clamp(12px,1.3vw,25px)] lg:leading-[min(1.37vw,26.25px)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {guests.body && (
              <PortableTextContent
                value={guests.body}
                className="mt-10 space-y-5 text-[17px] leading-[1.45] text-foreground sm:text-[20px] lg:mt-[min(3.44vw,66px)] lg:space-y-[min(2.45vw,47px)] lg:text-[clamp(12px,1.3vw,25px)] lg:leading-[min(1.82vw,35px)] [&_em]:font-heading [&_em]:font-light [&_em]:italic [&_em]:text-[1.25em] lg:[&_em]:text-[1.8em] [&_em]:leading-[1]"
              />
            )}
          </div>
        </div>
      </Container>

      {photos.length > 0 && (
        <>
          {/* Десктоп: правая половина секции целиком, в край окна. */}
          <Collage photos={photos} className="absolute inset-y-0 left-1/2 right-0 hidden lg:grid" />
          {/* Мобильная/планшет: тот же коллаж под текстом, на всю ширину экрана
              и с той же пропорцией, что у половины секции на десктопе. */}
          <Collage
            photos={photos}
            className="mt-12 w-full lg:hidden"
            style={{ aspectRatio: COLLAGE_ASPECT }}
          />
        </>
      )}
    </section>
  );
}


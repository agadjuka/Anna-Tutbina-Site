import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

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
    /* Всё ниже снято с узлов Figma (секция `5:189`, 1921×1051):
       эйбрау y=63, заголовок y=111 (53px/59, курсив — primary), пункты списка
       с y=209 с шагом 75.6 (25px/26.25, ✦ на x=171, текст на x=219),
       абзацы y=679 и y=836 (25px/35, выделение — Cormorant 45px),
       коллаж x 954…1770, y 184…894 (816×710). Метод — `figma-parity-checklist.md`. */
    <section id="guests" className="relative bg-background py-16 lg:min-h-[min(54.71vw,1051px)] lg:py-0 lg:pb-[min(5.1vw,98px)] lg:pt-[min(3.28vw,63px)]">
      {/* `size="wide"` — в макете этот блок заметно шире остальных: контент идёт
          от 165px до 1770px при 1920 (1605px). С общим контейнером 1280px текст
          стоял на 187px правее макета, а коллаж сжимался по ширине и растягивался
          по высоте. Правка заказчика, см. `docs/redesign/client-feedback-2026-08.md`
          п. 3.5. */}
      {/* Поля по бокам. Раньше здесь стоял голый `lg:px-0`, и это ломало
          всё между 1024 и 1578px: контейнер `wide` шире экрана на этих
          ширинах, поэтому запаса от потолка 1578px нет, а собственные поля
          обнулены — текст упирался прямо в кромки экрана (замер: 0px слева
          и справа на 1024, 1280 и 1440; на 1600 оставалось 11px). На 1920
          всё выглядело правильно, потому что поля там берутся не из padding,
          а из разницы 1920 − 1578, поделённой пополам, — те самые 171px
          из макета. Замечание заказчика 2026-08-21.

          `clamp` добирает поле до 32px ровно тогда, когда запаса от потолка
          не хватает, и уходит в ноль, как только он появляется:
            1920 → 32 − 171 < 0      → 0,   поле 171px (как в макете)
            1600 → 32 − 11  = 21     → 21,  поле 32px
            1440 и уже → упирается в 32 →  поле 32px
          Ступеньки на границе нет — значение меняется плавно с шириной окна. */}
      <Container size="wide" className="lg:px-[clamp(0px,2rem_-_(100vw_-_1578px)/2,2rem)]">
        {guests.eyebrow && (
          <SectionEyebrow className="text-center text-subtle">
            {guests.eyebrow}
          </SectionEyebrow>
        )}

        <div className="mt-10 flex flex-col gap-12 lg:mt-[min(1.46vw,28px)] lg:flex-row lg:items-stretch lg:gap-[3%]">
          <div className="lg:w-[46.6%]">
            {(guests.heading || guests.headingAccent) && (
              <h2 className="font-heading text-[32px] leading-tight text-foreground sm:text-[40px] lg:text-[clamp(40px,2.76vw,53px)] lg:leading-[min(3.07vw,59px)]">
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
                    <span aria-hidden="true" className="text-[16px] leading-[26px] text-primary lg:text-[clamp(16px,1vw,19px)] lg:leading-[26.25px]">
                      ✦
                    </span>
                    <span className="text-[17px] leading-snug text-foreground sm:text-[20px] lg:text-[clamp(20px,1.3vw,25px)] lg:leading-[min(1.37vw,26.25px)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {guests.body && (
              <PortableTextContent
                value={guests.body}
                className="mt-10 space-y-5 text-[17px] leading-[1.45] text-foreground sm:text-[20px] lg:mt-[min(3.44vw,66px)] lg:space-y-[min(2.45vw,47px)] lg:text-[clamp(20px,1.3vw,25px)] lg:leading-[min(1.82vw,35px)] [&_em]:font-heading [&_em]:font-light [&_em]:italic [&_em]:text-[1.25em] lg:[&_em]:text-[1.8em] [&_em]:leading-[1]"
              />
            )}
          </div>

          {photos.length > 0 && (
            <div className="lg:mt-[min(3.7vw,71px)] lg:w-[50.4%]">
              {/* Десктоп: коллаж с перекрытием, как в макете. Пропорция ЖЁСТКАЯ —
                  816×710 из макета (координаты бокса x 954…1770, y 184…894).
                  Раньше здесь было `h-full` от растянутой строки: коллаж
                  подстраивался под высоту текстовой колонки и вместе с ней
                  вытягивался в почти вертикальный прямоугольник (608×1065 при
                  1920). Верхнее групповое фото должно быть широким (2.17:1), а
                  становилось почти квадратным (1.01:1) — `object-cover` срезал
                  людей по краям, из-за чего в макете видна вся группа, а на сайте
                  только центр. Это и есть замечание «расположение и масштаб
                  фотографий привести в соответствие с Figma»
                  (`docs/redesign/client-feedback-2026-08.md`, п. 3.5). */}
              <div className="relative hidden w-full lg:block lg:aspect-[816/710]">
                {photos.slice(0, PHOTOS.length).map((photo, index) => (
                  <div
                    key={index}
                    className={`absolute overflow-hidden ${PHOTOS[index].box}`}
                    style={{ borderRadius: PHOTOS[index].radius }}
                  >
                    {/* `sizes` обязателен в режиме `fill` (см. CLAUDE.md): плитки
                        коллажа занимают 20–49% ширины окна, без подсказки браузер
                        считал бы их во всю ширину и тянул 3840px-вариант. */}
                    <SanityImage
                      image={photo}
                      fill
                      aspectRatio={PHOTOS[index].aspectRatio}
                      sizes="(max-width: 1023px) 50vw, 30vw"
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

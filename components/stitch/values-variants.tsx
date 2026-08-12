import { VALUES, num } from "./content";

/**
 * Два концепта секции «Почему нас выбирают» для превью-песочницы
 * `/stitch-preview/values`.
 *
 * Главная претензия заказчика к текущей версии — «карточки generic», а на
 * мобильном сетка 2×3 ещё и зажимает абзац до 2–3 слов в строке. Оба варианта
 * ниже убирают двухколоночную сетку на мобильном: текст получает полную ширину.
 * Цвета — только токены; полупрозрачные оттенки через relative color syntax.
 */

/** Общая шапка секции. */
function ValuesHeader({ onDark }: { onDark: boolean }) {
  return (
    <header className="text-center">
      <p
        className="text-[12px] font-medium uppercase tracking-[0.22em]"
        style={{
          color: onDark ? "rgb(from var(--color-on-primary) r g b / 0.7)" : "var(--color-subtle)",
        }}
      >
        {VALUES.eyebrow}
      </p>
      <h2
        className={`mt-4 font-heading text-[32px] leading-[1.05] tracking-[0.02em] sm:text-[44px] ${
          onDark ? "text-on-primary" : "text-primary"
        }`}
      >
        {VALUES.heading}
      </h2>
    </header>
  );
}

/**
 * Вариант A — «редакторский нумерованный список» на тёмном фоне.
 * Вместо шести белых плашек — сплошной список строк, разделённых волосяной
 * линией. Номер — крупная курсивная цифра Cormorant, приглушённая до фона;
 * заголовок стоит с ней на одной базовой линии, абзац идёт на всю ширину.
 * Десктоп: две колонки того же списка.
 */
export function ValuesVariantA() {
  return (
    <section className="w-full bg-primary px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <ValuesHeader onDark />

        <ul className="mt-12 lg:grid lg:grid-cols-2 lg:gap-x-14">
          {VALUES.items.map((item, i) => (
            <li
              key={item.title}
              className="border-t border-on-primary/20 py-7 first:border-t-0 first:pt-0 lg:py-8 lg:[&:nth-child(-n+2)]:border-t-0 lg:[&:nth-child(-n+2)]:pt-0"
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="font-heading text-[30px] italic leading-none"
                  style={{ color: "rgb(from var(--color-on-primary) r g b / 0.45)" }}
                >
                  {num(i)}
                </span>
                <h3 className="font-heading text-[24px] leading-[1.1] text-on-primary sm:text-[27px]">
                  {item.title}
                </h3>
              </div>
              <p
                className="mt-3 pl-[calc(30px+1rem)] text-[15px] leading-[1.62]"
                style={{ color: "rgb(from var(--color-on-primary) r g b / 0.78)" }}
              >
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Вариант B — «светлые строки с крупной цифрой-подложкой».
 * Секция уходит на фон сайта, номер становится крупной «призрачной» цифрой
 * (`--color-subtle-border`), на которую слегка наезжает заголовок — приём
 * журнальной вёрстки. Карточек нет вообще, ритм держат волосяные линии.
 * Десктоп: три колонки.
 */
export function ValuesVariantB() {
  return (
    <section className="w-full bg-background px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <ValuesHeader onDark={false} />

        <ul className="mt-12 lg:grid lg:grid-cols-3 lg:gap-x-10">
          {VALUES.items.map((item, i) => (
            <li
              key={item.title}
              className="relative border-t border-subtle-border pb-8 pt-7 first:border-t-0 first:pt-2 lg:[&:nth-child(-n+3)]:border-t-0 lg:[&:nth-child(-n+3)]:pt-2"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none block font-heading text-[64px] italic leading-[0.7] text-subtle-border select-none"
              >
                {num(i)}
              </span>
              <h3 className="-mt-4 relative font-heading text-[25px] leading-[1.1] text-primary sm:text-[28px]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.62] text-text-deep">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

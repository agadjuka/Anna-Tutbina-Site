import { sanityClient } from "@/lib/sanity.client";
import { tourBySlugQuery, tourMetadataQuery, siteSettingsQuery } from "@/lib/sanity.queries";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { PortableTextContent } from "@/components/ui/portable-text";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TourGallery } from "@/components/sections/tour-gallery";
import { ProgramDaysCarousel } from "@/components/sections/program-days-carousel";
import { AccommodationCarousel } from "@/components/sections/accommodation-carousel";
import { IncludedNotIncludedSection } from "@/components/sections/included-not-included-section";
import { TourReviewsSection } from "@/components/sections/tour-reviews-section";
import { OrganizersSection } from "@/components/sections/organizers-section";
import { RecommendedFlightsSection } from "@/components/sections/recommended-flights-section";
import { TourNavigation } from "@/components/sections/tour-navigation";
import { WantToJoinButton } from "@/components/sections/want-to-join-button";
import { normalizeTourReviews, type TourReviewRaw } from "@/lib/utils/reviews";
import { hasPricingSectionContent } from "@/lib/utils/tour-pricing";
import { tourFullTitle } from "@/lib/utils/tour-title";
import { TourPricingSection } from "@/components/sections/tour-pricing-section";
import { cn } from "@/lib/utils";
import { TOUR_BLOCK_WIDTH } from "@/lib/tour-layout";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Тур не найден",
      description: "Запрашиваемый тур не найден",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const tour = await sanityClient.fetch<{
    name?: string;
    place?: string | null;
    shortDescription?: string;
  } | null>(tourMetadataQuery, { slug });

  if (!tour || !tour.name) {
    return {
      title: "Тур не найден",
      description: "Запрашиваемый тур не найден",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  /* «Место · Название» — в Sanity это два поля, а в заголовке вкладки и в
     превью ссылки тур должен читаться одной строкой. См. `tourFullTitle`. */
  const fullTitle = tourFullTitle(tour.name, tour.place);
  const description = tour.shortDescription || `Подробная информация о туре ${fullTitle}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `/tours/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `/tours/${slug}`,
      type: "article",
      images: [
        {
          url: "https://www.ona-womantravel.com/Logo/web-app-manifest-512x512.png",
          type: "image/png",
        },
      ],
    },
    twitter: {
      title: fullTitle,
      description,
      images: ["https://www.ona-womantravel.com/Logo/web-app-manifest-512x512.png"],
    },
  };
}

interface Price {
  value: number;
  currency: string;
}

interface ProgramDay {
  dayTitle?: string;
  dayImage?: any[];
  dayDescription?: any;
}

interface AccommodationLocation {
  locationName?: string;
  locationImages?: any[];
  locationDescription?: any;
}

interface Organizer {
  name?: string;
  photo?: any;
  bio?: string;
}

interface RecommendedFlights {
  image?: any;
  text?: any;
}

interface TourData {
  _id: string;
  name: string;
  /** Место (город/страна). Вместе с `name` даёт полное имя тура — `tourFullTitle`. */
  place?: string | null;
  slug: { current: string };
  mainImage: any;
  overlayName?: any;
  overlayDate?: any;
  introText?: any;
  atmosphereGallery?: any[];
  programByDays?: ProgramDay[];
  accommodation?: AccommodationLocation[];
  dates?: string;
  price?: Price;
  pricingDetails?: any;
  included?: any;
  notIncluded?: any;
  recommendedFlights?: RecommendedFlights;
  organizers?: Organizer[];
  reviews?: TourReviewRaw[];
}

export default async function TourPage({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const [tour, siteSettings] = await Promise.all([
    sanityClient.fetch<TourData | null>(tourBySlugQuery, { slug }),
    sanityClient.fetch<{
      primaryContacts?: Array<{
        label?: string;
        url?: string;
        icon?: string;
      }>;
    } | null>(siteSettingsQuery),
  ]);

  if (!tour) {
    notFound();
  }

  const reviews = normalizeTourReviews(tour.reviews, tour._id);

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <Container>
        <div className="space-y-12 md:space-y-16">
          {(tour.dates || tour.price) && (
            <header className="space-y-6">
              <div className="w-full flex justify-center">
                <div className={cn("w-full", TOUR_BLOCK_WIDTH)}>
                  {/* Даты и цена — ОДИН стиль на подпись и один на значение.
                      Раньше здесь стояли три разных набора: подпись «Даты:»
                      мелким капсом телесного шрифта, само значение — 24px
                      телесным, а цена — 30px жирным, да ещё и без подписи. Три
                      начертания в одной строке читались как три разных элемента
                      (замечание заказчика 2026-08-21).

                      Теперь подписи — тот же `SectionEyebrow`, что над блоками
                      главной, значения — Cormorant одного кегля. С 25.08 у даты
                      и цены стиль значения СОВПАДАЕТ полностью, включая цвет
                      (`text-primary`) — правка заказчика «сделай стиль у
                      значения дат таким же, как у значения цены». Раньше дата
                      была `text-foreground`, а цена выделялась цветом как
                      акцент; выделения больше нет, пара читается как одна
                      строка данных.

                      ⚠️ РАСКЛАДКА ПЕРЕСОБРАНА 2026-08-25, у мобильной и
                      десктопа она РАЗНАЯ.

                      Промежуточный вариант (21.08) ставил подпись НАД значением
                      — на телефоне блок разворачивался в четыре строки столбиком
                      («ДАТЫ» / дата / «СТОИМОСТЬ» / цена), заказчику это не
                      понравилось.

                      <md: каждая пара занимает всю ширину, подпись прижата к
                      левому краю, значение — к правому (`w-full justify-between`).
                      Две строки с выключкой по краям вместо текста, слипшегося
                      у левого края.

                      md+: пары сжимаются по содержимому (`md:w-auto`,
                      `md:justify-start`) и встают в одну строку — даты слева,
                      цена вправо через `md:ml-auto`. Это и есть та раскладка,
                      что была до 21.08. Десктоп заказчик просил не трогать,
                      поэтому мобильная логика — база, а `md`-варианты её
                      снимают, а не наоборот.

                      Возвращена именно РАСКЛАДКА, а не прежняя типографика:
                      три разных начертания — отдельная жалоба заказчика от
                      21.08, её чинили специально, и откатывать её не за чем. */}
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-border pt-6">
                    {tour.dates && (
                      <div className="flex w-full items-baseline justify-between gap-2 md:w-auto md:justify-start">
                        <SectionEyebrow className="text-subtle">Даты</SectionEyebrow>
                        <p className="font-heading text-[26px] leading-tight text-primary md:text-[32px]">
                          {tour.dates}
                        </p>
                      </div>
                    )}
                    {tour.price && (
                      <div className="flex w-full items-baseline justify-between gap-2 md:ml-auto md:w-auto md:justify-start">
                        <SectionEyebrow className="text-subtle">Стоимость</SectionEyebrow>
                        <p className="font-heading text-[26px] leading-tight text-primary md:text-[32px]">
                          от {tour.price.value} {tour.price.currency}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>
          )}

          {tour.mainImage && (
            <div className="w-full flex justify-center">
              <div className={cn("w-full", TOUR_BLOCK_WIDTH)}>
                <div className="relative overflow-hidden rounded-2xl shadow-card">
                  <SanityImage
                    image={tour.mainImage}
                    width={1280}
                    height={720}
                    alt={tourFullTitle(tour.name, tour.place)}
                    className="w-full h-auto object-cover"
                  />
                  {tour.overlayName && (
                    <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ top: '30%' }}>
                      <div className="text-center px-4 md:px-8 max-w-full">
                        <PortableText
                          value={tour.overlayName}
                          components={{
                            block: {
                              normal: ({ children }) => (
                                <p 
                                  className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                                >
                                  {children}
                                </p>
                              ),
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {tour.overlayDate && (
                    <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ top: '66%' }}>
                      <div className="text-center px-4 md:px-8 max-w-full">
                        <PortableText
                          value={tour.overlayDate}
                          components={{
                            block: {
                              normal: ({ children }) => (
                                <p 
                                  className="text-base md:text-lg lg:text-xl xl:text-2xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                                >
                                  {children}
                                </p>
                              ),
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <TourNavigation
                  sections={[
                    { id: "about-tour", label: "О туре", available: !!tour.introText },
                    { id: "program", label: "Что нас ждет?", available: !!(tour.programByDays && tour.programByDays.length > 0) },
                    { id: "accommodation", label: "Размещение", available: !!(tour.accommodation && tour.accommodation.length > 0) },
                    { id: "pricing", label: "Стоимость", available: hasPricingSectionContent(tour.pricingDetails) },
                    { id: "conditions", label: "Условия", available: !!(tour.included || tour.notIncluded) },
                    { id: "flights", label: "Рейсы", available: !!tour.recommendedFlights },
                    { id: "reviews", label: "Отзывы", available: !!(reviews && reviews.length > 0) },
                    { id: "organizers", label: "Организаторы", available: !!(tour.organizers && tour.organizers.length > 0) },
                    { id: "gallery", label: "Галерея", available: !!(tour.atmosphereGallery && tour.atmosphereGallery.length > 0) },
                  ]}
                />
              </div>
            </div>
          )}

          {tour.introText && (
            <section id="about-tour" className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-4">
                  О туре
                </SectionHeading>
              </div>
              <div className="w-full flex justify-center">
                {/* Ширина как у остальных блоков — по правке заказчика 2026-08-21
                    («раздел о туре не на всю ширину, отличается от других»).
                    До этого блок намеренно держали уже: строка в 1152px при кегле
                    20px — это ~150 знаков, длинновато для чтения. Если решим
                    вернуться к узкой колонке, менять здесь. */}
                <div className={cn("w-full prose prose-lg", TOUR_BLOCK_WIDTH)}>
                  <PortableTextContent 
                    value={tour.introText} 
                    className="text-base md:text-xl leading-relaxed text-muted-foreground" 
                  />
                </div>
              </div>
            </section>
          )}

          {tour.programByDays && tour.programByDays.length > 0 && (
            <section id="program" className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-6 md:mb-8">
                  Что нас ждет
                </SectionHeading>
              </div>
              <ProgramDaysCarousel days={tour.programByDays} />
            </section>
          )}

          {tour.accommodation && tour.accommodation.length > 0 && (
            <section id="accommodation" className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-6 md:mb-8">
                  Размещение
                </SectionHeading>
              </div>
              <AccommodationCarousel locations={tour.accommodation} />
            </section>
          )}

          {hasPricingSectionContent(tour.pricingDetails) && (
            <section id="pricing" className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-4">
                  Стоимость
                </SectionHeading>
              </div>
              <TourPricingSection pricingDetails={tour.pricingDetails} />
            </section>
          )}

          {(tour.included || tour.notIncluded) && (
            <section id="conditions" className="space-y-6">
              <div className="relative">
                <SectionHeading as="h2" className="mb-6 md:mb-8">
                  Условия
                </SectionHeading>
              </div>
              <IncludedNotIncludedSection 
                included={tour.included}
                notIncluded={tour.notIncluded}
              />
            </section>
          )}

          {tour.recommendedFlights && (
            <RecommendedFlightsSection flights={tour.recommendedFlights} />
          )}

          {reviews && reviews.length > 0 && (
            <TourReviewsSection reviews={reviews} />
          )}

          {tour.organizers && tour.organizers.length > 0 && (
            <OrganizersSection organizers={tour.organizers} />
          )}

        {tour.atmosphereGallery && tour.atmosphereGallery.length > 0 && (
          <TourGallery images={tour.atmosphereGallery} tourName={tourFullTitle(tour.name, tour.place)} title="Атмосфера наших туров" />
        )}

        {/* Кнопка "Хочу с Вами!" — в самом низу, сразу под галереей */}
        <section className="pt-0 -mt-24 md:-mt-32 pb-0">
          <WantToJoinButton contacts={siteSettings?.primaryContacts ?? []} />
        </section>
        </div>
      </Container>
    </main>
  );
}



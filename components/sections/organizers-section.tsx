import { SanityImage } from "@/components/ui/sanity-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { TOUR_BLOCK_WIDTH } from "@/lib/tour-layout";

interface Organizer {
  name?: string;
  photo?: any;
  bio?: string;
}

interface OrganizersSectionProps {
  organizers: Organizer[];
}

export function OrganizersSection({ organizers }: OrganizersSectionProps) {
  if (!organizers?.length) return null;

  // Определяем расположение в зависимости от количества
  const getLayout = (count: number) => {
    if (count === 1) return "flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-[calc(38.4*var(--ona-u))]";
    if (count === 2) return "space-y-12 md:space-y-16 lg:space-y-[calc(51.2*var(--ona-u))]";
    return "space-y-12 md:space-y-16 lg:space-y-[calc(51.2*var(--ona-u))]";
  };

  // Определяем максимальную ширину контейнера
  const getContainerWidth = (count: number) => {
    if (count === 1) return "max-w-4xl";
    return TOUR_BLOCK_WIDTH;
  };

  return (
    <section id="organizers" className="space-y-6 lg:space-y-[calc(19.2*var(--ona-u))]">
      <div className="relative">
        <SectionHeading as="h2" className="mb-6 md:mb-8 lg:mb-[calc(16*var(--ona-u))]">
          Организаторы
        </SectionHeading>
      </div>

      <div className="w-full flex justify-center">
        <div
          className={cn(
            "w-full",
            getLayout(organizers.length),
            getContainerWidth(organizers.length)
          )}
        >
          {organizers.map((organizer, index) => {
            const isSingle = organizers.length === 1;
            const isTwo = organizers.length === 2;
            
            return (
              <div
                key={index}
                  className={cn(
                  "group relative",
                  "flex flex-col md:flex-row items-center md:items-start",
                  "gap-6 md:gap-8 lg:gap-[calc(38.4*var(--ona-u))]",
                  index < organizers.length - 1 && "pb-12 md:pb-16 lg:pb-[calc(51.2*var(--ona-u))] border-b border-border"
                )}
              >
                {/* Фото организатора */}
                {organizer.photo && (
                  <div className="relative flex-shrink-0">
                    {/* Декоративные элементы вокруг фото */}
                    <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 via-muted/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -inset-3 bg-white/60 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Обертка для фото */}
                    <div className="relative transform group-hover:scale-[1.02] transition-transform duration-500">
                      <div className={cn(
                        "relative overflow-hidden rounded-full",
                        "ring-2 ring-border group-hover:ring-primary/40",
                        "transition-all duration-500 shadow-lg",
                        isSingle 
                          ? "w-32 h-32 md:w-36 md:h-36 lg:size-[calc(128*var(--ona-u))]"
                          : isTwo
                          ? "w-28 h-28 md:w-32 md:h-32 lg:size-[calc(115.2*var(--ona-u))]"
                          : "w-24 h-24 md:w-28 md:h-28 lg:size-[calc(102.4*var(--ona-u))]"
                      )}>
                        <SanityImage
                          image={organizer.photo}
                          width={800}
                          height={800}
                          alt={organizer.name || "Организатор"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Декоративная точка при hover */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg transform group-hover:scale-110" />
                    </div>
                  </div>
                )}

                {/* Текстовый контент */}
                <div className="flex-1 text-center md:text-left space-y-4 lg:space-y-[calc(12.8*var(--ona-u))]">
                  {/* Имя */}
                  {organizer.name && (
                    <div>
                      {/* Единственный заголовок на сайте, набранный телесным шрифтом
                          (`font-sans font-semibold`). Приведён к Cormorant, как имена
                          основательниц в блоке FOUNDERS на главной (задача Н9). */}
                      {/* От `lg` — как имена создателей на главной: 27.8 / 32.5 × `--ona-u`. */}
                      <h3 className="text-[22px] md:text-[24px] lg:text-[calc(27.8*var(--ona-u))] lg:leading-[calc(32.5*var(--ona-u))] font-heading font-normal text-foreground mb-3 lg:mb-[calc(9.6*var(--ona-u))]">
                        {organizer.name}
                      </h3>
                      {/* Декоративная линия под именем */}
                      <div className={cn(
                        "h-px bg-gradient-to-r transition-all duration-500",
                        "from-transparent via-primary/50 to-transparent",
                        isSingle ? "w-20 md:w-24 lg:w-[calc(76.8*var(--ona-u))]" : "w-16 md:w-20 lg:w-[calc(64*var(--ona-u))]",
                        "opacity-60 group-hover:opacity-100"
                      )} />
                    </div>
                  )}

                  {/* Биография */}
                  {organizer.bio && (
                    <p className={cn(
                      "text-muted-foreground leading-relaxed",
                      isSingle 
                        ? "text-sm md:text-base"
                        : isTwo
                        ? "text-sm md:text-base"
                        : "text-sm md:text-base",
                      "max-w-none",
                      "lg:text-[calc(12.9*var(--ona-u))] lg:leading-[calc(20.6*var(--ona-u))]"
                    )}>
                      {organizer.bio}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

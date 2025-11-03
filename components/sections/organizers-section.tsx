import { SanityImage } from "@/components/ui/sanity-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

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
    if (count === 1) return "flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12";
    if (count === 2) return "space-y-12 md:space-y-16";
    return "space-y-12 md:space-y-16";
  };

  // Определяем максимальную ширину контейнера
  const getContainerWidth = (count: number) => {
    if (count === 1) return "max-w-3xl";
    return "max-w-4xl";
  };

  return (
    <section id="organizers" className="space-y-6">
      <div className="relative">
        <SectionHeading as="h2" className="mb-6 md:mb-8">
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
                  "gap-6 md:gap-8 lg:gap-12",
                  index < organizers.length - 1 && "pb-12 md:pb-16 border-b border-[#e5e0db]"
                )}
              >
                {/* Фото организатора */}
                {organizer.photo && (
                  <div className="relative flex-shrink-0">
                    {/* Декоративные элементы вокруг фото */}
                    <div className="absolute -inset-6 bg-gradient-to-br from-[#bea692]/10 via-[#e5e0db]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -inset-3 bg-white/60 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Обертка для фото */}
                    <div className="relative transform group-hover:scale-[1.02] transition-transform duration-500">
                      <div className={cn(
                        "relative overflow-hidden rounded-full",
                        "ring-2 ring-[#e5e0db] group-hover:ring-[#bea692]/40",
                        "transition-all duration-500 shadow-lg",
                        isSingle 
                          ? "w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
                          : isTwo
                          ? "w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
                          : "w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
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
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#bea692] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg transform group-hover:scale-110" />
                    </div>
                  </div>
                )}

                {/* Текстовый контент */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  {/* Имя */}
                  {organizer.name && (
                    <div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-sans font-semibold text-foreground mb-3">
                        {organizer.name}
                      </h3>
                      {/* Декоративная линия под именем */}
                      <div className={cn(
                        "h-px bg-gradient-to-r transition-all duration-500",
                        "from-transparent via-[#bea692]/50 to-transparent",
                        isSingle ? "w-20 md:w-24" : "w-16 md:w-20",
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
                      "max-w-none"
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

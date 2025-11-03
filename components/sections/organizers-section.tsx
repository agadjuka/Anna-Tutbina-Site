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
    if (count === 1) return "flex justify-center";
    if (count === 2) return "grid md:grid-cols-2 gap-8";
    return "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
  };

  // Определяем максимальную ширину контейнера
  const getContainerWidth = (count: number) => {
    if (count === 1) return "max-w-md";
    return "max-w-4xl";
  };

  return (
    <section className="space-y-6">
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
          {organizers.map((organizer, index) => (
            <div
              key={index}
              className={cn(
                "group relative",
                "bg-white rounded-2xl border border-[#e5e0db]",
                "shadow-card hover:shadow-card-hover",
                "transition-all duration-500",
                "hover:border-[#bea692]/30",
                "overflow-hidden",
                "flex flex-col h-full",
                organizers.length === 1 ? "w-full" : ""
              )}
            >
              {/* Декоративные элементы */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#bea692]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl z-0" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#e5e0db]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl z-0" />
              
              {/* Контент */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col">
                {/* Фото организатора */}
                {organizer.photo && (
                  <div className="relative mb-6">
                    {/* Декоративная рамка */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#bea692]/10 via-[#e5e0db]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Обертка для фото с эффектом */}
                    <div className="relative transform group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute -inset-2 bg-white/80 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                        <SanityImage
                          image={organizer.photo}
                          width={192}
                          height={192}
                          alt={organizer.name || "Организатор"}
                          className="w-full h-full rounded-full object-cover ring-4 ring-[#e5e0db] group-hover:ring-[#bea692]/40 transition-all duration-500 shadow-lg"
                        />
                      </div>
                      
                      {/* Декоративные точки */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#bea692] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg" />
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#e5e0db] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                )}

                {/* Имя */}
                {organizer.name && (
                  <div className="mb-4 text-center">
                    <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
                      {organizer.name}
                    </h3>
                    {/* Декоративная линия под именем */}
                    <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#bea692]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* Биография */}
                {organizer.bio && (
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
                      {organizer.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Декоративная граница снизу */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bea692]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


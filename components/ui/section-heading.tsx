import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  variant?: "default" | "light";
}

export function SectionHeading({ 
  children, 
  className,
  as: Component = "h2",
  variant = "default"
}: SectionHeadingProps) {
  const textColor = variant === "light" 
    ? "text-white/90" 
    : "text-[#bea692]";
  
  const lineColor = variant === "light"
    ? "bg-white/30"
    : "bg-[#bea692]";

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="max-w-4xl w-full flex items-center gap-3 md:gap-4">
        <div
          className={cn(
            // Линия заполняет всё доступное пространство, но не уже 10% экрана
            "h-px flex-1 min-w-[10vw] md:min-w-0",
            lineColor
          )}
        />
        <Component 
          className={cn(
            // Мобильные: меньше межбуквенный интервал, переносы строк и длинных слов
            // Десктоп: поведение без изменений
            "font-heading text-base md:text-lg uppercase tracking-[0.14em] md:tracking-[0.2em] font-medium text-center md:text-left leading-tight md:leading-normal break-normal whitespace-normal hyphens-none md:whitespace-nowrap",
            textColor
          )}
        >
          {children}
        </Component>
        <div
          className={cn(
            // Линия заполняет всё доступное пространство, но не уже 10% экрана
            "h-px flex-1 min-w-[10vw] md:min-w-0",
            lineColor
          )}
        />
      </div>
    </div>
  );
}

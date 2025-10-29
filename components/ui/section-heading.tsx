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
      <div className="max-w-4xl w-full flex items-center gap-4">
        <div className={cn("h-px flex-1", lineColor)} />
        <Component 
          className={cn(
            "font-heading text-base md:text-lg uppercase tracking-[0.2em] font-medium whitespace-nowrap shrink-0",
            textColor
          )}
        >
          {children}
        </Component>
        <div className={cn("h-px flex-1", lineColor)} />
      </div>
    </div>
  );
}

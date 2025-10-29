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
    <div className={cn("w-full flex items-center justify-center gap-4", className)}>
      <div className={cn("h-px w-48 md:w-80 lg:w-96 shrink-0", lineColor)} />
      <Component 
        className={cn(
          "text-sm md:text-base uppercase tracking-[0.2em] font-medium whitespace-nowrap shrink-0",
          textColor
        )}
      >
        {children}
      </Component>
      <div className={cn("h-px w-48 md:w-80 lg:w-96 shrink-0", lineColor)} />
    </div>
  );
}

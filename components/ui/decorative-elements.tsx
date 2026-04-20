import { cn } from "@/lib/utils";

export function DecorativeLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent",
        className
      )}
    />
  );
}

export function DecorativeCircle({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-full border border-primary/20", className)}
    />
  );
}

export function DecorativeDot({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full bg-primary/30", className)} />
  );
}

export function DecorativeBlur({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute rounded-full blur-3xl opacity-20", className)}
      style={{
        background: "radial-gradient(circle, #69695c 0%, transparent 70%)",
      }}
    />
  );
}

export function AsymmetricDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px overflow-hidden", className)}>
      <div className="absolute inset-0 bg-border" />
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-primary to-transparent" />
      <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-primary to-transparent" />
    </div>
  );
}

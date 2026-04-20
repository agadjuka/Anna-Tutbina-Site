import { cn } from "@/lib/utils";

/** Общий вид кнопок «Читать дальше» / «Свернуть» */
export const reviewActionButtonClass = cn(
  "group/revbtn relative inline-flex max-w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-border bg-white/90 px-3.5 py-1.5 font-sans text-xs text-muted-foreground",
  "shadow-sm transition-all duration-200 ease-out",
  "hover:border-primary/40 hover:bg-background/80 hover:text-foreground hover:shadow-md",
  "active:scale-[0.97] active:transition-[transform] active:duration-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  "md:text-sm"
);

export const reviewActionIconClass =
  "h-3 w-3 shrink-0 text-primary/75 transition-transform duration-300 ease-out group-hover/revbtn:translate-y-0.5 group-hover/revbtn:text-primary";

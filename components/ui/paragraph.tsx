import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function Paragraph({ children, className, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-base md:text-xl leading-relaxed font-sans text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}




import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  function Paragraph({ children, className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("text-base md:text-xl leading-relaxed font-sans text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);




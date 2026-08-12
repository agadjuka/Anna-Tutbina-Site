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
        className={cn(
          "font-sans text-base leading-relaxed text-foreground md:text-xl",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);




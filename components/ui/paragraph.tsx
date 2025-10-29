import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Paragraph({ children, className, ...props }: ParagraphProps) {
  return (
    <p className={cn("text-base leading-relaxed font-sans", className)} {...props}>
      {children}
    </p>
  );
}




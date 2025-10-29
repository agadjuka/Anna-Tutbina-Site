import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-screen-xl mx-auto px-4 md:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}




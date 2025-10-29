import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}

export function Heading({ as = "h1", children, className, ...props }: HeadingProps) {
  const Component = as;

  const headingStyles = {
    h1: "text-4xl md:text-6xl font-bold",
    h2: "text-3xl md:text-5xl font-bold",
    h3: "text-2xl md:text-4xl font-semibold",
    h4: "text-xl md:text-3xl font-semibold",
  };

  return (
    <Component
      className={cn("font-heading", headingStyles[as], className)}
      {...props}
    >
      {children}
    </Component>
  );
}




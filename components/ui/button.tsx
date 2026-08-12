import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
  href?: string;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-base";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-primary",
  secondary:
    "bg-background text-primary border border-primary/35 hover:bg-muted hover:border-primary/50 focus-visible:ring-primary shadow-sm",
  ghost:
    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-primary",
  outline:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-background focus-visible:ring-primary",
};

export function Button({
  className,
  children,
  variant = "primary",
  asChild,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (asChild) {
    return <div className={classes}>{children}</div>;
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

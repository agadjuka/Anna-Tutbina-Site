"use client";

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
  "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm md:text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#bea692] text-white hover:bg-[#a68f7a] hover:shadow-lg hover:shadow-[#bea692]/25 focus:ring-[#bea692] ring-offset-background",
  secondary:
    "bg-white text-foreground hover:bg-[#e5e0db] border border-[#e5e0db] focus:ring-[#bea692] ring-offset-background shadow-sm",
  ghost: 
    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[#e5e0db]/50 focus:ring-[#bea692] ring-offset-background",
  outline:
    "bg-transparent text-[#bea692] border-2 border-[#bea692] hover:bg-[#bea692] hover:text-white focus:ring-[#bea692] ring-offset-background",
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

  if (asChild && href) {
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



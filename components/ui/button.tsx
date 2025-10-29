"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
  href?: string;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm md:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white hover:bg-zinc-800 focus:ring-zinc-700 ring-offset-white",
  secondary:
    "bg-white text-black hover:bg-zinc-100 border border-zinc-200 focus:ring-zinc-300 ring-offset-white",
  ghost: "bg-transparent text-black hover:bg-zinc-100 focus:ring-zinc-300 ring-offset-white",
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



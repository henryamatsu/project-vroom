"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500",
      secondary:
        "bg-neutral-700 text-white hover:bg-neutral-600 focus:ring-neutral-500",
      danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
      ghost:
        "bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white focus:ring-neutral-500",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

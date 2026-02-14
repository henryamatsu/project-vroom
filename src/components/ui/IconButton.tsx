"use client";

import { forwardRef } from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the button (required for icon-only buttons) */
  "aria-label": string;
  /** Optional size variant */
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = "", size = "md", children, ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-14 w-14",
    };
    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

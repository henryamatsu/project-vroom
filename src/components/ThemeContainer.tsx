"use client";
import { ReactNode, useEffect, useState, startTransition } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeContainer({ children }: Props) {
  const [theme, setTheme] = useState("dark-theme"); // default for SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Runs only on client
    const storedTheme = localStorage.getItem("theme") ?? "dark-theme";

    startTransition(() => {
      setTheme(storedTheme); // update theme
      setMounted(true); // mark as mounted
    });
  }, []);

  useEffect(() => {
    if (!mounted) return; // don't touch DOM before mount
    document.body.className = theme;
    localStorage.setItem("theme", theme);

    console.log(theme);
  }, [theme, mounted]);

  if (!mounted) return null; // prevent hydration mismatch

  return <div className={`${theme} theme-container`}>{children}</div>;
}

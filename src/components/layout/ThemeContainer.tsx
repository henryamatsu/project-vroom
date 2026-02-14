"use client";

import { ReactNode, useEffect, useState, startTransition } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeContainer({ children }: Props) {
  const [theme, setTheme] = useState("dark-theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") ?? "dark-theme";
    startTransition(() => {
      setTheme(storedTheme);
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) return null;

  return <div className={`${theme} theme-container`}>{children}</div>;
}

"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function applyTheme(t: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("prooflearn_theme") as "dark" | "light" | null;
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("prooflearn_theme", next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label="Toggle theme"
        className="w-9 h-9 p-0 rounded-xl text-slate-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
      >
        <Moon className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to Skyblue & White Day Mode" : "Switch to Black & Gold Night Mode"}
      title={theme === "dark" ? "Switch to Skyblue & White Day Mode" : "Switch to Black & Gold Night Mode"}
      className="w-9 h-9 p-0 rounded-xl text-sky-700 dark:text-amber-400 bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-amber-500/30 hover:border-sky-400 dark:hover:border-amber-400 hover:bg-sky-100 dark:hover:bg-amber-950/20 transition-all flex items-center justify-center relative overflow-hidden group shadow-xs"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-sky-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}

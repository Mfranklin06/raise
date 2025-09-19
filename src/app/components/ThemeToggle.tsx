"use client";

import React, { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  // Placeholder while hydrating — keeps layout identical server/client
  if (!mounted) {
    return (
      <Tooltip title="Alternar tema">
        <span>
          <IconButton
            aria-hidden
            disabled
            size="small"
            className="bg-white/6 dark:bg-black/10 rounded-md p-2"
          >
            <div className="h-5 w-5" />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  const toggle = () => {
    setAnimating(true);
    setTheme(isDark ? "light" : "dark");
    window.setTimeout(() => setAnimating(false), 300);
  };

  return (
    <Tooltip title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}>
      <IconButton
        onClick={toggle}
        aria-label="Alternar tema"
        aria-pressed={isDark}
        size="small"
        className="bg-white/6 hover:bg-white/10 dark:bg-black/10 dark:hover:bg-black/20 rounded-md p-2 transition-transform duration-200 shadow-sm"
        >
        <span
          className={`inline-block transform transition-all duration-300 ${
            animating ? "rotate-180 scale-105" : "rotate-0"
          }`}
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 text-yellow-400" aria-hidden />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-900 dark:text-gray-100" aria-hidden />
          )}
        </span>
      </IconButton>
    </Tooltip>
  );
}

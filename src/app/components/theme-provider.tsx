"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Tipando cores customizadas do MUI
declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      sidebar: Record<string, string>;
      charts: Record<string, string>;
    };
  }
  interface ThemeOptions {
    customColors?: {
      sidebar?: Record<string, string>;
      charts?: Record<string, string>;
    };
  }
}

// Função utilitária para puxar variáveis CSS
const cssVar = (name: string) => `var(--${name})`;

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const { theme: nextTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Sempre cria o tema antes do return para evitar erros de hooks
  const muiTheme: Theme = useMemo(() => {
    const mode: PaletteMode = nextTheme === "dark" ? "dark" : "light";

    return createTheme({
      palette: {
        mode,
        background: {
          default: cssVar("background"),
          paper: cssVar("card"),
        },
        text: {
          primary: cssVar("foreground"),
          secondary: cssVar("muted-foreground"),
        },
        primary: {
          main: cssVar("primary"),
          contrastText: cssVar("primary-foreground"),
        },
        secondary: {
          main: cssVar("secondary"),
          contrastText: cssVar("secondary-foreground"),
        },
        error: {
          main: cssVar("destructive"),
          contrastText: cssVar("destructive-foreground"),
        },
        info: {
          main: cssVar("accent"),
          contrastText: cssVar("accent-foreground"),
        },
        divider: cssVar("border"),
      },
      shape: {
        borderRadius: parseInt(cssVar("radius").replace("px", "")) || 10,
      },
      typography: {
        fontFamily: cssVar("font-sans"),
      },
      customColors: {
        sidebar: {
          main: cssVar("sidebar"),
          text: cssVar("sidebar-foreground"),
          primary: cssVar("sidebar-primary"),
          primaryText: cssVar("sidebar-primary-foreground"),
          accent: cssVar("sidebar-accent"),
          accentText: cssVar("sidebar-accent-foreground"),
          border: cssVar("sidebar-border"),
          ring: cssVar("sidebar-ring"),
        },
        charts: {
          chart1: cssVar("chart-1"),
          chart2: cssVar("chart-2"),
          chart3: cssVar("chart-3"),
          chart4: cssVar("chart-4"),
          chart5: cssVar("chart-5"),
        },
      },
    });
  }, [nextTheme]);

  // Evita renderizar antes do mount para não quebrar a detecção de tema do Tailwind
  if (!mounted) return null;

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme as useNextTheme } from 'next-themes';

// Cores convertidas do seu globals.css (OKLCH -> aproximado em HEX)
const colorTokens = {
  light: {
    background: '#ffffff',
    foreground: '#252525',
    card: '#ffffff',
    cardForeground: '#252525',
    popover: '#ffffff',
    popoverForeground: '#252525',
    primary: '#3385ff',
    primaryForeground: '#ffffff',
    secondary: '#f7f7f7',
    secondaryForeground: '#252525',
    muted: '#f7f7f7',
    mutedForeground: '#8b8b8b',
    accent: '#f7f7f7',
    accentForeground: '#252525',
    destructive: '#ea4c4c',
    destructiveForeground: '#ffffff',
    border: '#ebebeb',
    input: '#ebebeb',
    ring: '#b4b4b4',
  },
  dark: {
    background: '#252525',
    foreground: '#ffffff',
    card: '#252525',
    cardForeground: '#ffffff',
    popover: '#252525',
    popoverForeground: '#ffffff',
    primary: '#ffffff',
    primaryForeground: '#3385ff',
    secondary: '#434343',
    secondaryForeground: '#ffffff',
    muted: '#434343',
    mutedForeground: '#b3b3b3',
    accent: '#434343',
    accentForeground: '#ffffff',
    destructive: '#d32027',
    destructiveForeground: '#ffffff',
    border: '#434343',
    input: '#434343',
    ring: '#707070',
  },
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) inserted.push(serialized.name);
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useEffect(() => setMounted(true), []);

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) styles += cache.inserted[name];
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  const muiTheme = useMemo(() => {
    const mode = nextTheme === 'dark' ? 'dark' : 'light';
    const colors = colorTokens[mode];

    return createTheme({
      palette: {
        mode: mode,
        background: {
          default: colors.background,
          paper: colors.card,
        },
        text: {
          primary: colors.foreground,
          secondary: colors.mutedForeground,
        },
        primary: {
          main: colors.primary,
          contrastText: colors.primaryForeground,
        },
        secondary: {
          main: colors.secondary,
          contrastText: colors.secondaryForeground,
        },
        error: {
          main: colors.destructive,
          contrastText: colors.destructiveForeground,
        },
        divider: colors.border,
      },
      shape: { borderRadius: 10 },
      typography: { fontFamily: 'var(--font-sans), sans-serif' },
    });
  }, [nextTheme]);
  
  if (!mounted) return null;

  // Define o tema MUI baseado no next-themes


  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

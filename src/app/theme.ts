// theme.ts
import { createTheme } from '@mui/material/styles';

// Função utilitária para pegar as variáveis CSS
const cssVar = (name: string) => `var(--${name})`;

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: cssVar('background'),
      paper: cssVar('card'),
    },
    text: {
      primary: cssVar('foreground'),
      secondary: cssVar('muted-foreground'),
    },
    primary: {
      main: cssVar('primary'),
      contrastText: cssVar('primary-foreground'),
    },
    secondary: {
      main: cssVar('secondary'),
      contrastText: cssVar('secondary-foreground'),
    },
    error: {
      main: cssVar('destructive'),
      contrastText: cssVar('destructive-foreground'),
    },
    info: {
      main: cssVar('accent'),
      contrastText: cssVar('accent-foreground'),
    },
    divider: cssVar('border'),
    
  },
  shape: {
    borderRadius: parseInt(cssVar('radius').replace('px', '')) || 10,
  },
  typography: {
    fontFamily: cssVar('font-sans'),
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: cssVar('background'),
      paper: cssVar('card'),
    },
    text: {
      primary: cssVar('foreground'),
      secondary: cssVar('muted-foreground'),
    },
    primary: {
      main: cssVar('primary'),
      contrastText: cssVar('primary-foreground'),
    },
    secondary: {
      main: cssVar('secondary'),
      contrastText: cssVar('secondary-foreground'),
    },
    error: {
      main: cssVar('destructive'),
      contrastText: cssVar('destructive-foreground'),
    },
    info: {
      main: cssVar('accent'),
      contrastText: cssVar('accent-foreground'),
    },
    divider: cssVar('border'),
    
  },
  shape: {
    borderRadius: parseInt(cssVar('radius').replace('px', '')) || 10,
  },
  typography: {
    fontFamily: cssVar('font-sans'),
  },
  customColors:{
    sidebar: {
      main: cssVar('sidebar'),
      text: cssVar('sidebar-foreground'),
      primary: cssVar('sidebar-primary'),
      primaryText: cssVar('sidebar-primary-foreground'),
      accent: cssVar('sidebar-accent'),
      accentText: cssVar('sidebar-accent-foreground'),
      border: cssVar('sidebar-border'),
      ring: cssVar('sidebar-ring'),
    },
    charts: {
      chart1: cssVar('chart-1'),
      chart2: cssVar('chart-2'),
      chart3: cssVar('chart-3'),
      chart4: cssVar('chart-4'),
      chart5: cssVar('chart-5'),
    },
  }
});

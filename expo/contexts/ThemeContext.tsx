import createContextHook from '@nkzw/create-context-hook';
import { THEME, Theme } from '@/constants/theme';

const [ThemeProviderCtx, useThemeCtx] = createContextHook<Theme>(
  () => {
    // In the future, we can add logic here for switching themes (light/dark)
    // For now, we enforce the dark "Glow" theme.
    return THEME;
  },
  THEME
);

export const ThemeProvider = ThemeProviderCtx;
export const useTheme = useThemeCtx;

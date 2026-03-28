export const SPACING = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 12,
  s: 14,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const COLORS = {
  // Deep, rich dark theme base
  background: '#09090B', // Zinc 950
  surface: '#18181B', // Zinc 900
  surfaceHighlight: '#27272A', // Zinc 800
  
  // Text
  textPrimary: '#FAFAFA', // Zinc 50
  textSecondary: '#A1A1AA', // Zinc 400
  textTertiary: '#52525B', // Zinc 600

  // Accents (Glow)
  primary: '#F472B6', // Pink 400
  primaryForeground: '#831843', // Pink 900
  
  secondary: '#A78BFA', // Violet 400
  
  accent: '#FBBF24', // Amber 400

  // Semantic
  success: '#34D399', // Emerald 400
  error: '#F87171', // Red 400
  warning: '#FBBF24', // Amber 400
  
  border: '#27272A', // Zinc 800
  divider: '#27272A', // Zinc 800
} as const;

export const THEME = {
  spacing: SPACING,
  radius: RADIUS,
  fontSize: FONT_SIZE,
  colors: COLORS,
} as const;

export type Theme = typeof THEME;

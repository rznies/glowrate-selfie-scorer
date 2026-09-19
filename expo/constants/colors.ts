const Colors = {
  primary: '#FF6B9D',
  secondary: '#FF9F43',
  accent: '#FFD93D',
  coral: '#FF7675',
  purple: '#A855F7',
  mint: '#6BCB77',
  background: '#0F0F1A',
  card: '#1A1A2E',
  cardLight: '#252542',
  text: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B8A',
  border: '#2D2D4A',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradient: {
    primary: ['#FF6B9D', '#FF9F43'] as const,
    secondary: ['#A855F7', '#FF6B9D'] as const,
    gold: ['#FFD93D', '#FF9F43'] as const,
    fire: ['#FF7675', '#FF9F43', '#FFD93D'] as const,
  },
};

export default Colors;

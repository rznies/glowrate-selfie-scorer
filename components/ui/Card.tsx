import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 's' | 'm' | 'l';
}

export function Card({ 
  variant = 'default', 
  padding = 'm', 
  style, 
  children, 
  ...props 
}: CardProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'default': return theme.colors.surface;
      case 'outlined': return 'transparent'; // Or surface if you want bg + border
      case 'elevated': return theme.colors.surfaceHighlight;
      default: return theme.colors.surface;
    }
  };

  const getBorder = (): ViewStyle => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    }
    return {};
  };

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 's': return theme.spacing.s;
      case 'm': return theme.spacing.m;
      case 'l': return theme.spacing.l;
      default: return theme.spacing.m;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.radius.l,
    padding: getPadding(),
    ...getBorder(),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string; // Optional override
  align?: TextStyle['textAlign'];
}

export function Text({ 
  style, 
  variant = 'body', 
  weight = 'regular', 
  color, 
  align,
  children,
  ...props 
}: TextProps) {
  const theme = useTheme();

  const getFontSize = () => {
    switch (variant) {
      case 'h1': return theme.fontSize.xxl;
      case 'h2': return theme.fontSize.xl;
      case 'h3': return theme.fontSize.l;
      case 'body': return theme.fontSize.m;
      case 'label': return theme.fontSize.s;
      case 'caption': return theme.fontSize.xs;
      default: return theme.fontSize.m;
    }
  };

  const getLineHeight = (fontSize: number) => {
    return fontSize * 1.5;
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'regular': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  };

  const getTextColor = () => {
    if (color) return color;
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return theme.colors.textPrimary;
      case 'caption':
        return theme.colors.textSecondary;
      default:
        return theme.colors.textPrimary;
    }
  };

  const fontSize = getFontSize();
  
  const textStyle: TextStyle = {
    fontSize,
    lineHeight: getLineHeight(fontSize),
    fontWeight: getFontWeight(),
    color: getTextColor(),
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

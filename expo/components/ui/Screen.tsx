import React from 'react';
import { View, ViewProps, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export interface ScreenProps extends ViewProps {
  safeArea?: boolean; // Default true
  padding?: 'none' | 's' | 'm' | 'l';
}

export function Screen({ 
  safeArea = true, 
  padding = 'none',
  style, 
  children, 
  ...props 
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 's': return theme.spacing.s;
      case 'm': return theme.spacing.m;
      case 'l': return theme.spacing.l;
      default: return 0;
    }
  };

  const screenStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: safeArea ? insets.top : 0,
    paddingBottom: safeArea ? insets.bottom : 0,
    paddingLeft: safeArea ? insets.left : 0,
    paddingRight: safeArea ? insets.right : 0,
  };

  const contentContainerStyle = {
    flex: 1,
    padding: getPadding(),
  };

  return (
    <View style={[screenStyle, style]} {...props}>
      <StatusBar barStyle="light-content" />
      <View style={contentContainerStyle}>
        {children}
      </View>
    </View>
  );
}

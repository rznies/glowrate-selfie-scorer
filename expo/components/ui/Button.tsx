import React from 'react';
import { 
  TouchableOpacity, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Typography';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 's' | 'm' | 'l';
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'm', 
  label, 
  loading, 
  icon,
  fullWidth = false,
  style, 
  onPress,
  disabled,
  ...props 
}: ButtonProps) {
  const theme = useTheme();

  const handlePress = (e: GestureResponderEvent) => {
    if (loading || disabled) return;
    Haptics.selectionAsync();
    onPress?.(e);
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceHighlight;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.surfaceHighlight;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case 'primary': return theme.colors.primaryForeground;
      case 'secondary': return theme.colors.textPrimary;
      case 'outline': return theme.colors.textPrimary;
      case 'ghost': return theme.colors.textSecondary;
      default: return theme.colors.primaryForeground;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 's': return { paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.m };
      case 'm': return { paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.l };
      case 'l': return { paddingVertical: theme.spacing.l, paddingHorizontal: theme.spacing.xl };
      default: return { paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.l };
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? theme.colors.border : 'transparent',
    opacity: disabled ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...getPadding(),
  };

  return (
    <TouchableOpacity 
      style={[containerStyle, style]} 
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ 
        disabled: disabled || loading,
        busy: loading,
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text 
            weight="semibold" 
            color={getTextColor()}
            style={{ marginLeft: icon ? theme.spacing.s : 0 }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useApp } from '../context/AppContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style, accessibilityLabel }: ButtonProps) {
  const { theme } = useApp();

  const backgroundColor =
    variant === 'primary'
      ? theme.primary
      : variant === 'danger'
        ? theme.danger
        : variant === 'secondary'
          ? theme.primarySoft
          : 'transparent';
  const color = variant === 'primary' || variant === 'danger' ? '#FFFFFF' : theme.primaryDark;
  const borderColor = variant === 'ghost' ? theme.border : backgroundColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.84 : 1,
          minHeight: 52,
          borderRadius: theme.radius.md
        },
        style
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : <AppText variant="bodyStrong" style={{ color }}>{title}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 18
  }
});

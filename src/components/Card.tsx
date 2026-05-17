import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useApp } from '../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { theme } = useApp();
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.xl,
          borderWidth: 1,
          borderColor: theme.border,
          shadowColor: theme.shadow,
          ...theme.shadows.card
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

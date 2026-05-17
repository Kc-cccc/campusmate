import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useApp } from '../context/AppContext';

type Variant = 'hero' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
}

export function AppText({ variant = 'body', muted = false, style, ...props }: AppTextProps) {
  const { theme } = useApp();
  return <Text {...props} style={[theme.typography[variant], { color: muted ? theme.textMuted : theme.text }, style]} />;
}

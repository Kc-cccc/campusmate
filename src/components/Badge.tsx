import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { useApp } from '../context/AppContext';

interface BadgeProps {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const { theme } = useApp();
  const toneColor = tone === 'primary' ? theme.primary : tone === 'success' ? theme.success : tone === 'warning' ? theme.warning : tone === 'danger' ? theme.danger : theme.textMuted;
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: theme.chip, alignSelf: 'flex-start' }}>
      <AppText variant="caption" style={{ color: toneColor }}>{label}</AppText>
    </View>
  );
}

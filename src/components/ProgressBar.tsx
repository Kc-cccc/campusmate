import React from 'react';
import { View } from 'react-native';
import { useApp } from '../context/AppContext';
import { AppText } from './AppText';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  rightLabel?: string;
}

export function ProgressBar({ label, value, max, rightLabel }: ProgressBarProps) {
  const { theme } = useApp();
  const percent = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <AppText variant="caption">{label}</AppText>
        <AppText variant="caption" muted>{rightLabel ?? `${percent}%`}</AppText>
      </View>
      <View style={{ height: 8, borderRadius: 999, backgroundColor: theme.chip, overflow: 'hidden' }}>
        <View style={{ width: `${percent}%`, height: '100%', borderRadius: 999, backgroundColor: theme.primary }} />
      </View>
    </View>
  );
}

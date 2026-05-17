import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <AppText variant="subtitle">{title}</AppText>
        {subtitle ? <AppText variant="caption" muted>{subtitle}</AppText> : null}
      </View>
      {actionLabel && onAction ? <Button title={actionLabel} variant="ghost" onPress={onAction} style={{ minHeight: 38, paddingHorizontal: 12 }} /> : null}
    </View>
  );
}

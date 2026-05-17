import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { useApp } from '../context/AppContext';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useApp();
  return (
    <View style={{ alignItems: 'center', padding: 28, borderRadius: 24, backgroundColor: theme.surfaceMuted }}>
      <Feather name="inbox" size={34} color={theme.primary} />
      <AppText variant="subtitle" style={{ marginTop: 12, textAlign: 'center' }}>{title}</AppText>
      <AppText muted style={{ textAlign: 'center', marginTop: 6 }}>{message}</AppText>
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

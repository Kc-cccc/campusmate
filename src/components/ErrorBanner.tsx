import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useApp } from '../context/AppContext';

interface ErrorBannerProps {
  message?: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  const { theme } = useApp();
  if (!message) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: theme.mode === 'dark' ? '#321F2A' : '#F5E7E4', padding: 12, borderRadius: 16, marginBottom: 12 }}>
      <Feather name="alert-circle" size={18} color={theme.danger} />
      <AppText variant="caption" style={{ color: theme.danger, flex: 1 }}>{message}</AppText>
    </View>
  );
}

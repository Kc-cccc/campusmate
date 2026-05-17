import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppText } from './AppText';
import { useApp } from '../context/AppContext';

export function LoadingOverlay({ message = 'Loading CampusMate…' }: { message?: string }) {
  const { theme } = useApp();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, padding: 24 }}>
      <ActivityIndicator size="large" color={theme.primary} />
      <AppText muted style={{ marginTop: 12 }}>{message}</AppText>
    </View>
  );
}

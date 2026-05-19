import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function SettingsScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Settings</AppText>
        <AppText muted style={{ marginTop: 8 }}>Accessibility and preference controls are implemented in Sprint 3.</AppText>
      </Card>
    </Screen>
  );
}

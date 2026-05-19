import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function HomeScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Home</AppText>
        <AppText muted style={{ marginTop: 8 }}>This screen is prepared in the navigation flow and implemented in a later sprint.</AppText>
      </Card>
    </Screen>
  );
}

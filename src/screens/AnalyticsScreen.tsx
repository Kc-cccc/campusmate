import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function AnalyticsScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Analytics</AppText>
        <AppText muted style={{ marginTop: 8 }}>Progress charts and audio summaries are implemented in Sprint 3.</AppText>
      </Card>
    </Screen>
  );
}

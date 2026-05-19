import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function StudyScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Study timer</AppText>
        <AppText muted style={{ marginTop: 8 }}>Study session tracking is implemented in a later commit.</AppText>
      </Card>
    </Screen>
  );
}

import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function TasksScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Tasks</AppText>
        <AppText muted style={{ marginTop: 8 }}>Task list features are implemented in the next sprint.</AppText>
      </Card>
    </Screen>
  );
}

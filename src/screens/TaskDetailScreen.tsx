import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function TaskDetailScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Task details</AppText>
        <AppText muted style={{ marginTop: 8 }}>Task details and actions are implemented in a later commit.</AppText>
      </Card>
    </Screen>
  );
}

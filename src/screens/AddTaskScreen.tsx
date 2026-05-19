import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function AddTaskScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Add task</AppText>
        <AppText muted style={{ marginTop: 8 }}>Task creation is implemented in a later commit.</AppText>
      </Card>
    </Screen>
  );
}

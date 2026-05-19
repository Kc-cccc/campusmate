import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function LocationReminderScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Location reminder</AppText>
        <AppText muted style={{ marginTop: 8 }}>GPS and map reminders are implemented in Sprint 2.</AppText>
      </Card>
    </Screen>
  );
}

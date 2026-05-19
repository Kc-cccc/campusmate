import React from 'react';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';

export function HelpPrivacyScreen() {
  return (
    <Screen>
      <Card>
        <AppText variant="subtitle">Help and privacy</AppText>
        <AppText muted style={{ marginTop: 8 }}>User guidance and privacy information are implemented in the final sprint.</AppText>
      </Card>
    </Screen>
  );
}

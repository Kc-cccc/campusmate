import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpPrivacy'>;

export function HelpPrivacyScreen({ navigation }: Props) {
  return (
    <Screen>
      <Button title="← Back" variant="ghost" onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 18 }} />
      <AppText variant="title">Help & Privacy</AppText>
      <AppText muted style={{ marginBottom: 16 }}>Built-in user guide content for students using CampusMate.</AppText>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="subtitle">Getting started</AppText>
        <AppText muted style={{ marginTop: 8 }}>Login with email/password or continue as a guest. The dashboard highlights urgent tasks and provides quick access to add a new task.</AppText>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <AppText variant="subtitle">How to use CampusMate</AppText>
        <View style={{ gap: 8, marginTop: 8 }}>
          <AppText muted>1. Create a task with title, subject, deadline, priority, and optional campus location.</AppText>
          <AppText muted>2. Use Tasks to search, filter, mark complete, edit, or delete work.</AppText>
          <AppText muted>3. Start Study Session when focusing and save the session for analytics.</AppText>
          <AppText muted>4. Review Analytics and listen to the summary aloud.</AppText>
          <AppText muted>5. Change dark mode, text size, accessibility mode, and reminders in Settings.</AppText>
        </View>
      </Card>
      <Card>
        <AppText variant="subtitle">Privacy</AppText>
        <AppText muted style={{ marginTop: 8 }}>The app uses local storage by default. Firebase is only used when configured. Location is requested only for location reminders. No hard-coded API keys are stored in source code.</AppText>
      </Card>
    </Screen>
  );
}

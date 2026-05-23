import React from 'react';
import { View } from 'react-native';
import * as Speech from 'expo-speech';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { calculateAnalytics } from '../utils/analytics';

type Props = BottomTabScreenProps<MainTabParamList, 'Analytics'>;

export function AnalyticsScreen(_props: Props) {
  const { theme, tasks, sessions } = useApp();
  const analytics = calculateAnalytics(tasks, sessions);
  const maxDay = Math.max(...analytics.weeklyStudy.map((day) => day.minutes), 1);
  const maxSubject = Math.max(...analytics.subjectBreakdown.map((subject) => subject.minutes), 1);

  function speakSummary() {
    Speech.stop();
    Speech.speak(analytics.summaryText, { rate: 0.92, pitch: 1.0 });
  }

  return (
    <Screen>
      <AppText variant="title">Analytics</AppText>
      <AppText muted style={{ marginBottom: 16 }}>Study progress, task completion, and an accessible audio summary.</AppText>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption" muted>Study time</AppText>
          <AppText variant="subtitle">{Math.floor(analytics.totalStudyMinutes / 60)}h {analytics.totalStudyMinutes % 60}m</AppText>
        </Card>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption" muted>Completed</AppText>
          <AppText variant="subtitle">{analytics.completedTasks}/{tasks.length}</AppText>
        </Card>
      </View>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="subtitle" style={{ marginBottom: 12 }}>Weekly study</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 8 }}>
          {analytics.weeklyStudy.map((day) => {
            const height = Math.max(8, Math.round((day.minutes / maxDay) * 120));
            return (
              <View key={day.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ width: '72%', height, borderRadius: 999, backgroundColor: theme.primary }} />
                <AppText variant="caption" muted style={{ marginTop: 6 }}>{day.label}</AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="subtitle" style={{ marginBottom: 12 }}>Subject balance</AppText>
        {analytics.subjectBreakdown.map((subject) => (
          <ProgressBar key={subject.subjectId} label={subject.subjectName} value={subject.minutes} max={maxSubject} rightLabel={`${subject.minutes}m`} />
        ))}
      </Card>

      <Card>
        <AppText variant="subtitle">Productivity summary</AppText>
        <AppText muted style={{ marginVertical: 10 }}>{analytics.summaryText}</AppText>
        <Button title="Read summary aloud" onPress={speakSummary} />
        <Button title="Stop audio" variant="ghost" onPress={() => Speech.stop()} style={{ marginTop: 10 }} />
      </Card>
    </Screen>
  );
}

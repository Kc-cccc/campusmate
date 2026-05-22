import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useApp } from '../context/AppContext';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { createId } from '../utils/id';

type Props = BottomTabScreenProps<MainTabParamList, 'Study'>;

export function StudyScreen(_props: Props) {
  const { user, tasks, addSession } = useApp();
  const activeTasks = tasks.filter((task) => task.status !== 'completed');
  const [taskId, setTaskId] = useState(activeTasks[0]?.id);
  const timer = useStudyTimer(25 * 60);
  const selectedTask = tasks.find((task) => task.id === taskId);

  async function saveSession() {
    if (!user || timer.elapsedSeconds < 60) {
      Alert.alert('Session too short', 'Study for at least one minute before saving a session.');
      return;
    }
    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - timer.elapsedSeconds * 1000);
    await addSession({
      id: createId('session'),
      userId: user.id,
      taskId: selectedTask?.id,
      subjectId: selectedTask?.subjectId,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationMinutes: Math.max(1, Math.round(timer.elapsedSeconds / 60)),
      note: selectedTask ? `Focused on ${selectedTask.title}` : 'General focus session'
    });
    timer.reset();
    Alert.alert('Study session saved', 'Your focus time has been added to analytics.');
  }

  return (
    <Screen>
      <AppText variant="title">Study session</AppText>
      <AppText muted style={{ marginBottom: 16 }}>A Pomodoro-style timer linked to a task.</AppText>

      <Card style={{ alignItems: 'center', marginBottom: 18 }}>
        <AppText variant="caption" muted>Current task</AppText>
        <AppText variant="subtitle" style={{ textAlign: 'center' }}>{selectedTask?.title ?? 'General study'}</AppText>
        <View style={{ width: 220, height: 220, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginVertical: 24, borderWidth: 1, borderColor: '#D7E3EF' }}>
          <AppText variant="hero" style={{ fontSize: 54, lineHeight: 62 }}>{timer.formatted}</AppText>
          <AppText muted>Session 1 / 4 · Break 5:00</AppText>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title={timer.isRunning ? 'Pause' : 'Start'} onPress={timer.isRunning ? timer.pause : timer.start} style={{ flex: 1 }} />
          <Button title="Reset" variant="secondary" onPress={timer.reset} style={{ flex: 1 }} />
        </View>
        <Button title="Save session" variant="ghost" onPress={() => void saveSession()} style={{ marginTop: 10, alignSelf: 'stretch' }} />
      </Card>

      <Card>
        <AppText variant="label" style={{ marginBottom: 8 }}>Link to task</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {activeTasks.map((task) => <Chip key={task.id} label={task.title} selected={taskId === task.id} onPress={() => setTaskId(task.id)} />)}
        </View>
      </Card>
    </Screen>
  );
}

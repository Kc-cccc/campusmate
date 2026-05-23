import React from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { TaskCard } from '../components/TaskCard';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useApp } from '../context/AppContext';
import { useDeviceContext } from '../hooks/useDeviceContext';
import { calculateAnalytics } from '../utils/analytics';
import { daysUntil, isToday } from '../utils/date';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;

export function HomeScreen({ navigation }: Props) {
  const { theme, user, tasks, sessions, toggleTask, isLoading } = useApp();
  const device = useDeviceContext();
  const analytics = calculateAnalytics(tasks, sessions);
  if (isLoading) return <LoadingOverlay />;

  const todaysTasks = tasks.filter((task) => isToday(task.dueAt) && task.status !== 'completed');
  const urgentTasks = tasks.filter((task) => task.status !== 'completed' && daysUntil(task.dueAt) <= 2).slice(0, 3);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" muted>Good day, {user?.name ?? 'Student'}</AppText>
          <AppText variant="title">Your study command centre</AppText>
        </View>
        <Button title="+ Task" onPress={() => navigation.navigate('AddTask')} style={{ minHeight: 44 }} />
      </View>

      <Card style={{ marginBottom: 18, backgroundColor: theme.primarySoft }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={{ color: theme.primaryDark }}>Weekly progress</AppText>
            <AppText variant="hero" style={{ color: theme.primaryDark }}>{analytics.completionRate}%</AppText>
            <AppText muted>{analytics.completedTasks} completed · {analytics.pendingTasks} pending</AppText>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Feather name="trending-up" size={42} color={theme.primaryDark} />
          </View>
        </View>
        <ProgressBar label="Task completion" value={analytics.completedTasks} max={tasks.length || 1} />
      </Card>

      <Card style={{ marginBottom: 18 }}>
        <SectionHeader title="Device context" subtitle="Mobile capability use" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" muted>Battery</AppText>
            <AppText variant="bodyStrong">{device.batteryLevel ?? '--'}%</AppText>
            <AppText variant="caption" muted>{device.batteryState}</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" muted>Motion</AppText>
            <AppText variant="bodyStrong">{device.motionStatus}</AppText>
            <AppText variant="caption" muted>Accelerometer</AppText>
          </View>
        </View>
      </Card>

      <SectionHeader title="Today" subtitle="Quick actions for the next deadline" actionLabel="All tasks" onAction={() => navigation.navigate('MainTabs', { screen: 'Tasks' })} />
      {todaysTasks.length ? todaysTasks.map((task) => (
        <TaskCard  key={task.id} task={task} onToggle={() => void toggleTask(task.id)} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
      )) : <Card><AppText muted>No tasks due today. Use this time for a study session or plan ahead.</AppText></Card>}

      <SectionHeader title="Urgent deadlines" subtitle="Prioritised by due date" />
      {urgentTasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={() => void toggleTask(task.id)} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
      ))}
    </Screen>
  );
}

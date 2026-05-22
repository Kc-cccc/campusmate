import React from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { getSubjectName } from '../data/subjects';
import { formatDateTime } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({ navigation, route }: Props) {
  const { tasks, toggleTask, deleteTask } = useApp();
  const task = tasks.find((item) => item.id === route.params.taskId);

  if (!task) {
    return (
      <Screen>
        <Button title="← Back" variant="ghost" onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 18 }} />
        <Card><AppText>Task not found.</AppText></Card>
      </Screen>
    );
  }

  function confirmDelete() {
    Alert.alert('Delete task?', 'This removes the task from CampusMate.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void deleteTask(task.id).then(() => navigation.goBack()) }
    ]);
  }

  return (
    <Screen>
      <Button title="← Back" variant="ghost" onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 18 }} />
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppText variant="title">{task.title}</AppText>
            <AppText muted>{getSubjectName(task.subjectId)}</AppText>
          </View>
          <Badge label={task.status === 'completed' ? 'Completed' : task.priority} tone={task.status === 'completed' ? 'success' : task.priority === 'High' ? 'danger' : 'warning'} />
        </View>
        <AppText style={{ marginTop: 18 }}>{task.description}</AppText>
        <View style={{ marginTop: 18 }}>
          <AppText variant="label">Due date</AppText>
          <AppText>{formatDateTime(task.dueAt)}</AppText>
        </View>
        {task.locationReminder ? (
          <View style={{ marginTop: 18 }}>
            <AppText variant="label">Location reminder</AppText>
            <AppText>{task.locationReminder.placeName}</AppText>
            <AppText muted>{task.locationReminder.radiusMeters}m radius · {task.locationReminder.address}</AppText>
          </View>
        ) : null}
        <Button title={task.status === 'completed' ? 'Mark as pending' : 'Mark as complete'} onPress={() => void toggleTask(task.id)} style={{ marginTop: 22 }} />
        <Button title="Edit task" variant="secondary" onPress={() => navigation.navigate('AddTask', { taskId: task.id })} style={{ marginTop: 10 }} />
        <Button title="Delete task" variant="danger" onPress={confirmDelete} style={{ marginTop: 10 }} />
      </Card>
    </Screen>
  );
}

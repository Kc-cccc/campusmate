import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Task } from '../types/models';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { Card } from './Card';
import { useApp } from '../context/AppContext';
import { formatDateTime, isToday } from '../utils/date';
import { getSubjectName } from '../data/subjects';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

function priorityTone(priority: Task['priority']) {
  return priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success';
}

export function TaskCard({ task, onPress, onToggle }: TaskCardProps) {
  const { theme } = useApp();
  const completed = task.status === 'completed';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open task ${task.title}`}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            onPress={onToggle}
            style={[styles.check, { borderColor: completed ? theme.success : theme.border, backgroundColor: completed ? theme.success : 'transparent' }]}
          >
            {completed ? <Feather name="check" size={16} color="#fff" /> : null}
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong" style={{ textDecorationLine: completed ? 'line-through' : 'none' }}>{task.title}</AppText>
            <AppText variant="caption" muted>{getSubjectName(task.subjectId)} · {formatDateTime(task.dueAt)}</AppText>
            {task.locationReminder ? <AppText variant="caption" muted>{task.locationReminder.placeName}</AppText> : null}
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <Badge label={task.priority} tone={priorityTone(task.priority)} />
            {isToday(task.dueAt) ? <Badge label="Today" tone="primary" /> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  check: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }
});

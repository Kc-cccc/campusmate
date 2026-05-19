import React from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Task } from '../types/models';
import { Card } from './Card';
import { AppText } from './AppText';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/date';
import { getSubjectName } from '../data/subjects';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
}

export function TaskCard({ task, onToggle, onPress }: TaskCardProps) {
  const { theme } = useApp();
  const completed = task.status === 'completed';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.86 : 1, marginBottom: 12 })}>
      <Card style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            onPress={onToggle}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: completed ? theme.success : theme.border,
              backgroundColor: completed ? theme.success : theme.surface
            }}
          >
            {completed ? <Feather name="check" size={16} color="#FFFFFF" /> : null}
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong" style={{ textDecorationLine: completed ? 'line-through' : 'none' }}>{task.title}</AppText>
            <AppText variant="caption" muted>{getSubjectName(task.subjectId)} · {formatDateTime(task.dueAt)}</AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

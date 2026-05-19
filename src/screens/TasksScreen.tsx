import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { TaskCard } from '../components/TaskCard';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { filterTasks, type TaskFilter } from '../utils/taskFilters';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Tasks'>, NativeStackScreenProps<RootStackParamList>>;

const filters: TaskFilter[] = ['All', 'High', 'Medium', 'Low', 'Completed'];

export function TasksScreen({ navigation }: Props) {
  const { tasks, toggleTask } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('All');
  const visibleTasks = useMemo(() => filterTasks(tasks, query, filter), [filter, query, tasks]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View>
          <AppText variant="title">Tasks</AppText>
          <AppText muted>Search, filter, complete, or edit tasks.</AppText>
        </View>
        <Button title="Add" onPress={() => navigation.navigate('AddTask')} style={{ minHeight: 42 }} />
      </View>

      <TextField label="Search tasks" value={query} onChangeText={setQuery} placeholder="Search by title or description" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {filters.map((item) => <Chip key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} />)}
      </View>

      {visibleTasks.length ? visibleTasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={() => void toggleTask(task.id)} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
      )) : (
        <EmptyState title="No matching tasks" message="Try a different search term or create a new task." actionLabel="Create task" onAction={() => navigation.navigate('AddTask')} />
      )}
    </Screen>
  );
}

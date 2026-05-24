import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Priority } from '../types/models';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { TextField } from '../components/TextField';
import { ErrorBanner } from '../components/ErrorBanner';
import { subjects } from '../data/subjects';
import { useApp } from '../context/AppContext';
import { createId } from '../utils/id';
import { isoToDateInput, isoToTimeInput, parseDateTimeInput } from '../utils/date';
import { validateTask } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const priorities: Priority[] = ['Low', 'Medium', 'High'];

export function AddTaskScreen({ navigation, route }: Props) {
  const { user, tasks, selectedLocation, setSelectedLocation, addTask, updateTask } = useApp();
  const editTask = useMemo(() => tasks.find((task) => task.id === route.params?.taskId), [route.params?.taskId, tasks]);
  const [title, setTitle] = useState(editTask?.title ?? '');
  const [description, setDescription] = useState(editTask?.description ?? '');
  const [subjectId, setSubjectId] = useState(editTask?.subjectId ?? subjects[0]?.id ?? '');
  const [dueDate, setDueDate] = useState(editTask ? isoToDateInput(editTask.dueAt) : new Date().toISOString().slice(0, 10));
  const [dueTime, setDueTime] = useState(editTask ? isoToTimeInput(editTask.dueAt) : '17:00');
  const [priority, setPriority] = useState<Priority>(editTask?.priority ?? 'Medium');
  const [formError, setFormError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const location = selectedLocation ?? editTask?.locationReminder;

  async function save() {
    const validation = validateTask({ title, description, subjectId, dueDate, dueTime, priority });
    if (!validation.isValid) {
      setFormError(validation.message);
      return;
    }
    const dueAt = parseDateTimeInput(dueDate, dueTime);
    if (!dueAt || !user) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      if (editTask) {
        await updateTask({ ...editTask, title, description, subjectId, dueAt, priority, locationReminder: location ?? null, updatedAt: now });
      } else {
        await addTask({
          id: createId('task'),
          userId: user.id,
          title,
          description,
          subjectId,
          dueAt,
          priority,
          status: 'pending',
          reminderTime: new Date(new Date(dueAt).getTime() - 60 * 60 * 1000).toISOString(),
          locationReminder: location ?? null,
          createdAt: now,
          updatedAt: now
        });
      }
      setSelectedLocation(undefined);
      navigation.goBack();
    } catch (caught) {
      Alert.alert('Unable to save task', caught instanceof Error ? caught.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Button title="←" variant="ghost" onPress={() => navigation.goBack()} style={{ minHeight: 42, width: 48 }} />
        <View style={{ marginLeft: 8 }}>
          <AppText variant="title">{editTask ? 'Edit task' : 'Add task'}</AppText>
          <AppText muted>Time + place + priority in one focused form.</AppText>
        </View>
      </View>

      <ErrorBanner message={formError} />
      <Card>
        <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Enter task title" />
        <TextField label="Description" value={description} onChangeText={setDescription} placeholder="What needs to be done?" multiline style={{ minHeight: 96, textAlignVertical: 'top' }} />
        <AppText variant="label" style={{ marginBottom: 8 }}>Subject</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {subjects.map((subject) => <Chip key={subject.id} label={subject.code} selected={subjectId === subject.id} onPress={() => setSubjectId(subject.id)} />)}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><TextField label="Date" value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" /></View>
          <View style={{ width: 118 }}><TextField label="Time" value={dueTime} onChangeText={setDueTime} placeholder="HH:mm" /></View>
        </View>
        <AppText variant="label" style={{ marginBottom: 8 }}>Priority</AppText>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {priorities.map((item) => <Chip key={item} label={item} selected={priority === item} onPress={() => setPriority(item)} />)}
        </View>
        <Button title={location ? `Location: ${location.placeName}` : '+ Add location reminder'} variant="secondary" onPress={() => navigation.navigate('LocationReminder')} />
        <Button title={editTask ? 'Save changes' : 'Save task'} loading={saving} onPress={() => void save()} style={{ marginTop: 12 }} />
      </Card>
    </Screen>
  );
}


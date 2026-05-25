import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReminderLocation, Task } from '../types/models';
import { loadJsonValue, saveJsonValue } from './sqliteDatabase';

const backgroundReminderKey = 'campusmate.background.location.tasks';

export interface BackgroundReminderTask {
  taskId: string;
  userId: string;
  title: string;
  dueAt: string;
  locationReminder: ReminderLocation;
  lastNotifiedAt?: string;
}

export function toBackgroundReminderTasks(tasks: Task[]): BackgroundReminderTask[] {
  return tasks
    .filter((task) => task.status !== 'completed' && Boolean(task.locationReminder))
    .map((task) => ({
      taskId: task.id,
      userId: task.userId,
      title: task.title,
      dueAt: task.dueAt,
      locationReminder: task.locationReminder as ReminderLocation
    }));
}

export async function saveBackgroundReminderTasks(tasks: BackgroundReminderTask[]): Promise<void> {
  const savedToSqlite = await saveJsonValue(backgroundReminderKey, tasks);
  if (!savedToSqlite) {
    await AsyncStorage.setItem(backgroundReminderKey, JSON.stringify(tasks));
  }
}

export async function loadBackgroundReminderTasks(): Promise<BackgroundReminderTask[]> {
  const sqliteValue = await loadJsonValue<BackgroundReminderTask[]>(backgroundReminderKey);
  if (sqliteValue) return sqliteValue;

  const raw = await AsyncStorage.getItem(backgroundReminderKey);
  return raw ? (JSON.parse(raw) as BackgroundReminderTask[]) : [];
}

export async function markBackgroundReminderNotified(taskId: string, notifiedAt = new Date().toISOString()): Promise<void> {
  const reminders = await loadBackgroundReminderTasks();
  await saveBackgroundReminderTasks(reminders.map((reminder) => (
    reminder.taskId === taskId ? { ...reminder, lastNotifiedAt: notifiedAt } : reminder
  )));
}

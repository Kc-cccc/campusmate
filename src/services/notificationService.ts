import * as Notifications from 'expo-notifications';
import type { Task } from '../types/models';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleTaskReminder(task: Task): Promise<string | null> {
  const target = task.reminderTime ? new Date(task.reminderTime) : new Date(task.dueAt);
  const fireDate = task.reminderTime ? target : new Date(target.getTime() - 60 * 60 * 1000);
  if (fireDate.getTime() <= Date.now()) {
    return null;
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `CampusMate reminder: ${task.title}`,
      body: task.locationReminder
        ? `Due soon. Consider studying at ${task.locationReminder.placeName}.`
        : 'This task is coming up soon.',
      data: { taskId: task.id }
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate }
  });
}

import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { loadBackgroundReminderTasks, markBackgroundReminderNotified } from '../storage/backgroundReminderStorage';
import { isInsideReminderRadius } from './locationService';

export const BACKGROUND_LOCATION_TASK = 'campusmate-background-location-reminder';
const notificationCooldownMs = 4 * 60 * 60 * 1000;

type LocationTaskData = {
  locations: Location.LocationObject[];
};

TaskManager.defineTask<LocationTaskData>(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }) => {
    if (error) {
      console.warn('Background reminder task error', error.message);
      return;
    }

    const latest = data?.locations?.[0];
    if (!latest) {
      return;
    }

    const current = {
      latitude: latest.coords.latitude,
      longitude: latest.coords.longitude
    };

    const reminders = await loadBackgroundReminderTasks();
    await Promise.all(reminders.map(async (reminder) => {
      if (!isInsideReminderRadius(current, reminder.locationReminder)) {
        return;
      }

      const lastNotifiedAt = reminder.lastNotifiedAt ? new Date(reminder.lastNotifiedAt).getTime() : 0;
      if (Date.now() - lastNotifiedAt < notificationCooldownMs) {
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Near ${reminder.locationReminder.placeName}`,
          body: `${reminder.title} is linked to this campus location.`,
          data: { taskId: reminder.taskId, type: 'location-reminder' }
        },
        trigger: null
      });
      await markBackgroundReminderNotified(reminder.taskId);
    }));
  }
);

export async function startBackgroundReminderTask(): Promise<boolean> {
  const foreground = await Location.requestForegroundPermissionsAsync();

  if (!foreground.granted) {
    return false;
  }

  const background = await Location.requestBackgroundPermissionsAsync();

  if (!background.granted) {
    return false;
  }

  const notificationPermission = await Notifications.requestPermissionsAsync();
  if (!notificationPermission.granted) {
    return false;
  }

  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

  if (!started) {
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 150,
      deferredUpdatesDistance: 300,
      showsBackgroundLocationIndicator: false,
      pausesUpdatesAutomatically: true
    });
  }

  return true;
}

export async function stopBackgroundReminderTask(): Promise<void> {
  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

  if (started) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}

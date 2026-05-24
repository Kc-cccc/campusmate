import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const BACKGROUND_LOCATION_TASK = 'campusmate-background-location-reminder';

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

    if (latest) {
      console.log(
        'Background location update',
        latest.coords.latitude,
        latest.coords.longitude
      );
    }
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
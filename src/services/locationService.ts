import * as Location from 'expo-location';
import type { ReminderLocation } from '../types/models';
import { campusPlaces } from '../data/seed';

export async function requestLocationPermission(): Promise<boolean> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const requested = await Location.requestForegroundPermissionsAsync();
  return requested.granted;
}

export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  const granted = await requestLocationPermission();
  if (!granted) {
    return null;
  }
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };
}

export function searchCampusPlaces(query: string): ReminderLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return campusPlaces;
  }
  return campusPlaces.filter((place) =>
    [place.placeName, place.address].some((value) => value.toLowerCase().includes(q))
  );
}

export function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const earth = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(h));
}

export function isInsideReminderRadius(current: { latitude: number; longitude: number }, reminder: ReminderLocation): boolean {
  return distanceMeters(current, reminder) <= reminder.radiusMeters;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserPreferences } from '../types/models';
import { storageKeys } from './keys';

export const defaultPreferences: UserPreferences = {
  themeMode: 'light',
  textScale: 'medium',
  accessibilityMode: false,
  notificationsEnabled: true,
  backgroundLocationEnabled: false
};

export async function loadPreferences(): Promise<UserPreferences> {
  const raw = await AsyncStorage.getItem(storageKeys.preferences);
  if (!raw) {
    return defaultPreferences;
  }
  return { ...defaultPreferences, ...JSON.parse(raw) } as UserPreferences;
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  await AsyncStorage.setItem(storageKeys.preferences, JSON.stringify(preferences));
}

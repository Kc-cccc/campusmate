import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserPreferences } from '../types/models';
import { storageKeys } from './keys';
import { loadJsonValue, saveJsonValue } from './sqliteDatabase';

export const defaultPreferences: UserPreferences = {
  themeMode: 'light',
  textScale: 'medium',
  accessibilityMode: false,
  notificationsEnabled: true,
  backgroundLocationEnabled: false
};

export async function loadPreferences(): Promise<UserPreferences> {
  const sqliteValue = await loadJsonValue<UserPreferences>(storageKeys.preferences);
  if (sqliteValue) {
    return { ...defaultPreferences, ...sqliteValue };
  }

  const raw = await AsyncStorage.getItem(storageKeys.preferences);
  if (!raw) {
    return defaultPreferences;
  }

  const preferences = { ...defaultPreferences, ...JSON.parse(raw) } as UserPreferences;
  await saveJsonValue(storageKeys.preferences, preferences);
  return preferences;
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  const savedToSqlite = await saveJsonValue(storageKeys.preferences, preferences);
  if (!savedToSqlite) {
    await AsyncStorage.setItem(storageKeys.preferences, JSON.stringify(preferences));
  } else {
    await AsyncStorage.setItem(storageKeys.preferences, JSON.stringify(preferences));
  }
}

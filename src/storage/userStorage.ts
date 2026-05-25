import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/models';
import { storageKeys } from './keys';
import { deleteJsonValue, loadJsonValue, saveJsonValue } from './sqliteDatabase';

export async function loadStoredUser(): Promise<UserProfile | null> {
  const sqliteValue = await loadJsonValue<UserProfile>(storageKeys.user);
  if (sqliteValue) return sqliteValue;

  const raw = await AsyncStorage.getItem(storageKeys.user);
  if (!raw) return null;

  const user = JSON.parse(raw) as UserProfile;
  await saveJsonValue(storageKeys.user, user);
  return user;
}

export async function saveStoredUser(user: UserProfile): Promise<void> {
  const savedToSqlite = await saveJsonValue(storageKeys.user, user);
  if (!savedToSqlite) {
    await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
  } else {
    await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
  }
}

export async function clearStoredUser(): Promise<void> {
  await deleteJsonValue(storageKeys.user);
  await AsyncStorage.removeItem(storageKeys.user);
}

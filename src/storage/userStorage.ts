import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/models';
import { storageKeys } from './keys';

export async function loadStoredUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(storageKeys.user);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveStoredUser(user: UserProfile): Promise<void> {
  await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(storageKeys.user);
}

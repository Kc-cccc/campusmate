import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { seedStudySessions } from '../data/seed';
import { getFirebaseServices } from '../services/firebase';
import type { StudySession } from '../types/models';
import { storageKeys } from './keys';

export async function loadSessions(userId: string): Promise<StudySession[]> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    const q = query(collection(db, 'studySessions'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => item.data() as StudySession);
  }

  const raw = await AsyncStorage.getItem(storageKeys.sessions(userId));
  if (!raw) {
    const starter = seedStudySessions.map((session) => ({ ...session, userId }));
    await saveSessions(userId, starter);
    return starter;
  }
  return JSON.parse(raw) as StudySession[];
}

export async function saveSessions(userId: string, sessions: StudySession[]): Promise<void> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    await Promise.all(sessions.map((session) => setDoc(doc(db, 'studySessions', session.id), session)));
    return;
  }
  await AsyncStorage.setItem(storageKeys.sessions(userId), JSON.stringify(sessions));
}

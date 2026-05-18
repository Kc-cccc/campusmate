import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { seedTasks } from '../data/seed';
import type { Task } from '../types/models';
import { getFirebaseServices } from '../services/firebase';
import { storageKeys } from './keys';

export async function loadTasks(userId: string): Promise<Task[]> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => item.data() as Task);
  }

  const raw = await AsyncStorage.getItem(storageKeys.tasks(userId));
  if (!raw) {
    const starter = seedTasks.map((task) => ({ ...task, userId }));
    await saveTasks(userId, starter);
    return starter;
  }
  return JSON.parse(raw) as Task[];
}

export async function saveTasks(userId: string, tasks: Task[]): Promise<void> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    await Promise.all(tasks.map((task) => setDoc(doc(db, 'tasks', task.id), task)));
    return;
  }
  await AsyncStorage.setItem(storageKeys.tasks(userId), JSON.stringify(tasks));
}

export async function removeTask(userId: string, taskId: string): Promise<void> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    await deleteDoc(doc(db, 'tasks', taskId));
    return;
  }
  const existing = await loadTasks(userId);
  await saveTasks(userId, existing.filter((task) => task.id !== taskId));
}

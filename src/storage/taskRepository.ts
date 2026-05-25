import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { seedTasks } from '../data/seed';
import type { Task } from '../types/models';
import { getFirebaseServices } from '../services/firebase';
import { storageKeys } from './keys';
import { deleteTaskRow, loadJsonValue, loadTaskRows, replaceTaskRows, saveJsonValue } from './sqliteDatabase';

export async function loadTasks(userId: string): Promise<Task[]> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => item.data() as Task);
  }

  const sqliteInitialised = await loadJsonValue<boolean>(storageKeys.tasksInitialized(userId));
  const sqliteTasks = await loadTaskRows<Task>(userId);
  if (sqliteInitialised && sqliteTasks) {
    return sqliteTasks;
  }

  const raw = await AsyncStorage.getItem(storageKeys.tasks(userId));
  if (raw) {
    const existing = JSON.parse(raw) as Task[];
    await replaceTaskRows(userId, existing);
    await saveJsonValue(storageKeys.tasksInitialized(userId), true);
    return existing;
  }

  const starter = seedTasks.map((task) => ({ ...task, userId }));
  await saveTasks(userId, starter);
  return starter;
}

export async function saveTasks(userId: string, tasks: Task[]): Promise<void> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    await Promise.all(tasks.map((task) => setDoc(doc(db, 'tasks', task.id), task)));
    return;
  }

  const savedToSqlite = await replaceTaskRows(userId, tasks.map((task) => ({ ...task, userId })));
  await saveJsonValue(storageKeys.tasksInitialized(userId), true);
  if (!savedToSqlite) {
    await AsyncStorage.setItem(storageKeys.tasks(userId), JSON.stringify(tasks));
  } else {
    await AsyncStorage.setItem(storageKeys.tasks(userId), JSON.stringify(tasks));
  }
}

export async function removeTask(userId: string, taskId: string): Promise<void> {
  const { db, isConfigured } = getFirebaseServices();
  if (isConfigured && db) {
    await deleteDoc(doc(db, 'tasks', taskId));
    return;
  }

  const removedFromSqlite = await deleteTaskRow(taskId);
  const existing = await loadTasks(userId);
  const next = existing.filter((task) => task.id !== taskId);
  if (!removedFromSqlite) {
    await saveTasks(userId, next);
  } else {
    await AsyncStorage.setItem(storageKeys.tasks(userId), JSON.stringify(next));
  }
}

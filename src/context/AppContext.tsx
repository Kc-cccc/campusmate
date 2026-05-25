import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReminderLocation, StudySession, Task, TextScale, ThemeMode, UserPreferences, UserProfile } from '../types/models';
import { createTheme, type AppTheme } from '../theme/theme';
import { createGuestProfile, signInWithEmail, signOutUser, signUpWithEmail } from '../services/authService';
import { requestNotificationPermission, scheduleTaskReminder } from '../services/notificationService';
import { initializeAdMob, maybeShowInterstitialAd } from '../services/adMobService';
import { startBackgroundReminderTask, stopBackgroundReminderTask } from '../services/backgroundReminderTask';
import { loadPreferences, savePreferences, defaultPreferences } from '../storage/preferencesStorage';
import { clearStoredUser, loadStoredUser, saveStoredUser } from '../storage/userStorage';
import { loadTasks, removeTask, saveTasks } from '../storage/taskRepository';
import { loadSessions, saveSessions } from '../storage/sessionRepository';
import { saveBackgroundReminderTasks, toBackgroundReminderTasks } from '../storage/backgroundReminderStorage';

interface AppContextValue {
  theme: AppTheme;
  preferences: UserPreferences;
  user: UserProfile | null;
  tasks: Task[];
  sessions: StudySession[];
  selectedLocation?: ReminderLocation;
  isLoading: boolean;
  error: string | null;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setTextScale: (scale: TextScale) => Promise<void>;
  setAccessibilityMode: (enabled: boolean) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setBackgroundLocationEnabled: (enabled: boolean) => Promise<void>;
  setSelectedLocation: (location?: ReminderLocation) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addSession: (session: StudySession) => Promise<void>;
  reload: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ReminderLocation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useMemo(() => createTheme(preferences.themeMode, preferences.textScale), [preferences.themeMode, preferences.textScale]);

  const persistPreferences = useCallback(async (next: UserPreferences) => {
    setPreferences(next);
    await savePreferences(next);
  }, []);

  const syncBackgroundReminders = useCallback(async (nextTasks: Task[]) => {
    await saveBackgroundReminderTasks(toBackgroundReminderTasks(nextTasks));
  }, []);

  const hydrateForUser = useCallback(async (profile: UserProfile) => {
    const [loadedTasks, loadedSessions] = await Promise.all([loadTasks(profile.id), loadSessions(profile.id)]);
    setTasks(loadedTasks);
    setSessions(loadedSessions);
    await syncBackgroundReminders(loadedTasks);
  }, [syncBackgroundReminders]);

  const reload = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await hydrateForUser(user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to reload data.');
    } finally {
      setIsLoading(false);
    }
  }, [hydrateForUser, user]);

  useEffect(() => {
    async function boot() {
      setIsLoading(true);
      try {
        const [storedPreferences, storedUser] = await Promise.all([loadPreferences(), loadStoredUser()]);
        setPreferences(storedPreferences);
        void initializeAdMob();
        if (storedPreferences.backgroundLocationEnabled) {
          void startBackgroundReminderTask();
        }
        if (storedUser) {
          setUser(storedUser);
          await hydrateForUser(storedUser);
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load app data.');
      } finally {
        setIsLoading(false);
      }
    }
    void boot();
  }, [hydrateForUser]);

  const persistTasks = useCallback(async (nextTasks: Task[]) => {
    if (!user) return;
    setTasks(nextTasks);
    await saveTasks(user.id, nextTasks);
    await syncBackgroundReminders(nextTasks);
  }, [syncBackgroundReminders, user]);

  const persistSessions = useCallback(async (nextSessions: StudySession[]) => {
    if (!user) return;
    setSessions(nextSessions);
    await saveSessions(user.id, nextSessions);
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await signInWithEmail(email, password);
      setUser(profile);
      await saveStoredUser(profile);
      await hydrateForUser(profile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign in failed.');
      throw caught;
    } finally {
      setIsLoading(false);
    }
  }, [hydrateForUser]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await signUpWithEmail(email, password);
      setUser(profile);
      await saveStoredUser(profile);
      await hydrateForUser(profile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign up failed.');
      throw caught;
    } finally {
      setIsLoading(false);
    }
  }, [hydrateForUser]);

  const loginAsGuest = useCallback(async () => {
    const profile = createGuestProfile();
    setUser(profile);
    await saveStoredUser(profile);
    await hydrateForUser(profile);
  }, [hydrateForUser]);

  const signOut = useCallback(async () => {
    await signOutUser();
    await clearStoredUser();
    await syncBackgroundReminders([]);
    setUser(null);
    setTasks([]);
    setSessions([]);
  }, [syncBackgroundReminders]);

  const addTask = useCallback(async (task: Task) => {
    const next = [...tasks, task];
    await persistTasks(next);
    if (preferences.notificationsEnabled) {
      await scheduleTaskReminder(task);
    }
  }, [persistTasks, preferences.notificationsEnabled, tasks]);

  const updateTask = useCallback(async (task: Task) => {
    const next: Task[] = tasks.map((item) => (item.id === task.id ? task : item));
    await persistTasks(next);
    if (preferences.notificationsEnabled) {
      await scheduleTaskReminder(task);
    }
  }, [persistTasks, preferences.notificationsEnabled, tasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;
    const next = tasks.filter((task) => task.id !== taskId);
    setTasks(next);
    await removeTask(user.id, taskId);
    await syncBackgroundReminders(next);
  }, [syncBackgroundReminders, tasks, user]);

  const toggleTask = useCallback(async (taskId: string) => {
    const now = new Date().toISOString();

    const next: Task[] = tasks.map((task): Task => {
      if (task.id !== taskId) {
        return task;
      }

      const nextStatus: Task['status'] =
        task.status === 'completed' ? 'pending' : 'completed';

      return {
        ...task,
        status: nextStatus,
        updatedAt: now
      };
    });

    await persistTasks(next);
  }, [persistTasks, tasks]);

  const addSession = useCallback(async (session: StudySession) => {
    await persistSessions([...sessions, session]);
    void maybeShowInterstitialAd('study-session-saved');
  }, [persistSessions, sessions]);

  const setThemeMode = useCallback((mode: ThemeMode) => persistPreferences({ ...preferences, themeMode: mode }), [persistPreferences, preferences]);
  const setTextScale = useCallback((scale: TextScale) => persistPreferences({ ...preferences, textScale: scale }), [persistPreferences, preferences]);
  const setAccessibilityMode = useCallback((enabled: boolean) => persistPreferences({ ...preferences, accessibilityMode: enabled }), [persistPreferences, preferences]);
  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setError('Notification permission was not granted.');
        return;
      }
    }
    await persistPreferences({ ...preferences, notificationsEnabled: enabled });
  }, [persistPreferences, preferences]);
  const setBackgroundLocationEnabled = useCallback(async (enabled: boolean) => {
    const ok = enabled ? await startBackgroundReminderTask() : true;
    if (!ok) {
      setError('Background location permission was not granted.');
      return;
    }
    if (!enabled) {
      await stopBackgroundReminderTask();
    }
    await persistPreferences({ ...preferences, backgroundLocationEnabled: enabled });
  }, [persistPreferences, preferences]);

  const value = useMemo<AppContextValue>(() => ({
    theme,
    preferences,
    user,
    tasks,
    sessions,
    selectedLocation,
    isLoading,
    error,
    setThemeMode,
    setTextScale,
    setAccessibilityMode,
    setNotificationsEnabled,
    setBackgroundLocationEnabled,
    setSelectedLocation,
    signIn,
    signUp,
    loginAsGuest,
    signOut,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addSession,
    reload
  }), [addSession, addTask, deleteTask, error, isLoading, loginAsGuest, preferences, reload, selectedLocation, sessions, setAccessibilityMode, setBackgroundLocationEnabled, setNotificationsEnabled, setTextScale, setThemeMode, signIn, signOut, signUp, tasks, theme, toggleTask, updateTask, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return value;
}

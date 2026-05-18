export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'pending' | 'completed';
export type TextScale = 'small' | 'medium' | 'large';
export type ThemeMode = 'light' | 'dark';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface ReminderLocation {
  id: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  subjectId: string;
  dueAt: string;
  priority: Priority;
  status: TaskStatus;
  reminderTime?: string;
  locationReminder?: ReminderLocation;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  taskId?: string;
  subjectId?: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
}

export interface UserPreferences {
  themeMode: ThemeMode;
  textScale: TextScale;
  accessibilityMode: boolean;
  notificationsEnabled: boolean;
  backgroundLocationEnabled: boolean;
}

export interface DeviceContextSummary {
  batteryLevel: number | null;
  batteryState: string;
  motionStatus: 'still' | 'moving' | 'unknown';
}

import type { Priority } from '../types/models';
import { parseDateTimeInput } from './date';

export interface TaskFormValues {
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return ok ? { isValid: true } : { isValid: false, message: 'Enter a valid email address.' };
}

export function validatePassword(password: string): ValidationResult {
  return password.length >= 6
    ? { isValid: true }
    : { isValid: false, message: 'Password must be at least 6 characters.' };
}

export function validateTask(values: TaskFormValues): ValidationResult {
  if (values.title.trim().length < 3) {
    return { isValid: false, message: 'Task title must be at least 3 characters.' };
  }
  if (values.description.trim().length < 5) {
    return { isValid: false, message: 'Add a short task description.' };
  }
  if (!values.subjectId) {
    return { isValid: false, message: 'Select a subject.' };
  }
  const dueAt = parseDateTimeInput(values.dueDate, values.dueTime);
  if (!dueAt) {
    return { isValid: false, message: 'Use date as YYYY-MM-DD and time as HH:mm.' };
  }
  return { isValid: true };
}

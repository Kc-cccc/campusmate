import { calculateAnalytics } from '../utils/analytics';
import type { StudySession, Task } from '../types/models';

describe('calculateAnalytics', () => {
  it('calculates task completion and total study time', () => {
    const tasks: Task[] = [
      { id: '1', userId: 'u', title: 'A', description: 'A', subjectId: 'math', dueAt: new Date().toISOString(), priority: 'High', status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', userId: 'u', title: 'B', description: 'B', subjectId: 'math', dueAt: new Date().toISOString(), priority: 'Low', status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    const sessions: StudySession[] = [
      { id: 's1', userId: 'u', subjectId: 'math', startedAt: new Date().toISOString(), endedAt: new Date().toISOString(), durationMinutes: 45 }
    ];
    const result = calculateAnalytics(tasks, sessions);
    expect(result.completedTasks).toBe(1);
    expect(result.pendingTasks).toBe(1);
    expect(result.totalStudyMinutes).toBe(45);
    expect(result.completionRate).toBe(50);
  });
});
it('returns zero completion rate when there are no tasks', () => {
  const result = calculateAnalytics([], []);
  expect(result.completedTasks).toBe(0);
  expect(result.pendingTasks).toBe(0);
  expect(result.completionRate).toBe(0);
});

it('builds a readable productivity summary', () => {
  const result = calculateAnalytics([], []);
  expect(result.summaryText).toContain('This week you studied');
});
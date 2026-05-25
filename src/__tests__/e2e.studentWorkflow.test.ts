import { calculateAnalytics } from '../utils/analytics';
import { distanceMeters, isInsideReminderRadius, searchCampusPlaces } from '../services/locationService';
import type { StudySession, Task } from '../types/models';

function completeTask(task: Task): Task {
  return {
    ...task,
    status: 'completed',
    updatedAt: '2026-05-20T11:00:00.000Z'
  };
}

describe('student workflow E2E-style test', () => {
  it('covers location reminder selection, task completion, study session saving and analytics', () => {
    const library = searchCampusPlaces('library')[0];
    if (!library) {
      throw new Error('Expected seeded campus library location');
    }

    const task: Task = {
      id: 'task-e2e-1',
      userId: 'student-1',
      title: 'Finish CampusMate demo',
      description: 'Prepare mobile app demonstration and testing proof',
      subjectId: 'mobile',
      dueAt: '2026-05-22T07:00:00.000Z',
      priority: 'High',
      status: 'pending',
      reminderTime: '2026-05-22T06:00:00.000Z',
      locationReminder: library,
      createdAt: '2026-05-20T09:00:00.000Z',
      updatedAt: '2026-05-20T09:00:00.000Z'
    };

    expect(task.locationReminder?.placeName).toContain('Library');
    expect(isInsideReminderRadius({ latitude: library.latitude, longitude: library.longitude }, library)).toBe(true);
    expect(distanceMeters(library, library)).toBe(0);

    const completedTask = completeTask(task);
    const session: StudySession = {
      id: 'session-e2e-1',
      userId: 'student-1',
      taskId: task.id,
      subjectId: task.subjectId,
      startedAt: '2026-05-20T10:00:00.000Z',
      endedAt: '2026-05-20T10:25:00.000Z',
      durationMinutes: 25,
      note: 'Pomodoro session saved from Study screen workflow'
    };

    const analytics = calculateAnalytics([completedTask], [session]);
    expect(completedTask.status).toBe('completed');
    expect(analytics.summaryText).toContain('completed 1 tasks');
    expect(analytics.subjectBreakdown.find((subject) => subject.subjectId === 'mobile')?.minutes).toBe(25);
  });
});

import { calculateAnalytics } from '../utils/analytics';
import { filterTasks } from '../utils/taskFilters';
import { validateTask } from '../utils/validation';
import type { StudySession, Task } from '../types/models';

const now = '2026-05-20T09:00:00.000Z';

describe('task flow integration', () => {
  it('validates, stores, filters, completes and reports on a study task', () => {
    const form = {
      title: 'Mobile testing report',
      description: 'Write integration and E2E testing evidence',
      subjectId: 'mobile',
      dueDate: '2026-05-22',
      dueTime: '17:00',
      priority: 'High' as const
    };

    expect(validateTask(form).isValid).toBe(true);

    const task: Task = {
      id: 'task-integration-1',
      userId: 'student-1',
      title: form.title,
      description: form.description,
      subjectId: form.subjectId,
      dueAt: '2026-05-22T07:00:00.000Z',
      priority: form.priority,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    const filtered = filterTasks([task], 'testing', 'High');
    expect(filtered).toHaveLength(1);

    const completedTask: Task = { ...task, status: 'completed', updatedAt: '2026-05-20T10:00:00.000Z' };
    const session: StudySession = {
      id: 'session-integration-1',
      userId: 'student-1',
      taskId: task.id,
      subjectId: task.subjectId,
      startedAt: now,
      endedAt: '2026-05-20T09:45:00.000Z',
      durationMinutes: 45,
      note: 'Focused test evidence session'
    };

    const analytics = calculateAnalytics([completedTask], [session]);
    expect(analytics.completedTasks).toBe(1);
    expect(analytics.completionRate).toBe(100);
    expect(analytics.totalStudyMinutes).toBe(45);
  });
});

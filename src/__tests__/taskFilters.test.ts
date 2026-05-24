import { filterTasks } from '../utils/taskFilters';
import type { Task } from '../types/models';

const baseTask = {
  userId: 'user-1',
  description: 'Test description',
  subjectId: 'math',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z'
};

const tasks: Task[] = [
  {
    ...baseTask,
    id: 'task-1',
    title: 'Math assignment',
    dueAt: '2026-05-20T10:00:00.000Z',
    priority: 'High',
    status: 'pending'
  },
  {
    ...baseTask,
    id: 'task-2',
    title: 'History reading',
    dueAt: '2026-05-19T10:00:00.000Z',
    priority: 'Low',
    status: 'completed'
  },
  {
    ...baseTask,
    id: 'task-3',
    title: 'Physics quiz',
    dueAt: '2026-05-21T10:00:00.000Z',
    priority: 'Medium',
    status: 'pending'
  }
];

describe('filterTasks', () => {
  it('filters tasks by search query', () => {
    const result = filterTasks(tasks, 'physics', 'All');
    const first = result[0];

    expect(result).toHaveLength(1);
    expect(first).toBeDefined();
    expect(first?.title).toBe('Physics quiz');
  });

  it('filters completed tasks', () => {
    const result = filterTasks(tasks, '', 'Completed');
    const first = result[0];

    expect(result).toHaveLength(1);
    expect(first).toBeDefined();
    expect(first?.status).toBe('completed');
  });

  it('filters tasks by priority', () => {
    const result = filterTasks(tasks, '', 'High');
    const first = result[0];

    expect(result).toHaveLength(1);
    expect(first).toBeDefined();
    expect(first?.priority).toBe('High');
  });

  it('sorts tasks by due date ascending', () => {
    const result = filterTasks(tasks, '', 'All');

    expect(result.map((task) => task.id)).toEqual(['task-2', 'task-1', 'task-3']);
  });
});
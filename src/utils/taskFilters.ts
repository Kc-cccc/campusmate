import type { Priority, Task } from '../types/models';

export type TaskFilter = 'All' | Priority | 'Completed';

export function filterTasks(tasks: Task[], query: string, filter: TaskFilter): Task[] {
  const q = query.trim().toLowerCase();
  return tasks
    .filter((task) => {
      const matchesQuery = !q || task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Completed' && task.status === 'completed') ||
        task.priority === filter;
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

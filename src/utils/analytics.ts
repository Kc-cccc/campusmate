import type { StudySession, Task } from '../types/models';
import { subjects } from '../data/subjects';

export interface AnalyticsSummary {
  totalStudyMinutes: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  weeklyStudy: Array<{ label: string; minutes: number }>;
  subjectBreakdown: Array<{ subjectId: string; subjectName: string; minutes: number; completed: number }>;
  summaryText: string;
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function calculateAnalytics(tasks: Task[], sessions: StudySession[]): AnalyticsSummary {
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;
  const totalStudyMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const weeklyStudy = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = dayLabels[date.getDay()] ?? 'Day';
    const minutes = sessions.reduce((sum, session) => {
      const sessionDate = new Date(session.startedAt);
      const sameDay =
        date.getFullYear() === sessionDate.getFullYear() &&
        date.getMonth() === sessionDate.getMonth() &&
        date.getDate() === sessionDate.getDate();
      return sameDay ? sum + session.durationMinutes : sum;
    }, 0);
    return { label, minutes };
  });

  const subjectBreakdown = subjects.map((subject) => {
    const subjectSessions = sessions.filter((session) => session.subjectId === subject.id);
    const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      minutes: subjectSessions.reduce((sum, session) => sum + session.durationMinutes, 0),
      completed: subjectTasks.filter((task) => task.status === 'completed').length
    };
  });

  const hours = Math.floor(totalStudyMinutes / 60);
  const minutes = totalStudyMinutes % 60;
  const summaryText = `This week you studied for ${hours} hours and ${minutes} minutes, completed ${completedTasks} tasks, and have ${pendingTasks} tasks left. Your completion rate is ${completionRate} percent.`;

  return { totalStudyMinutes, completedTasks, pendingTasks, completionRate, weeklyStudy, subjectBreakdown, summaryText };
}

import type { ReminderLocation, StudySession, Task } from '../types/models';
import { buildISODate } from '../utils/date';

export const demoUserId = 'local-demo-user';

export const campusPlaces: ReminderLocation[] = [
  {
    id: 'library',
    placeName: 'University Library',
    address: 'Bundoora Campus Library',
    latitude: -37.7217,
    longitude: 145.0482,
    radiusMeters: 300
  },
  {
    id: 'science-hub',
    placeName: 'Science Hub',
    address: 'Main Science Building',
    latitude: -37.7209,
    longitude: 145.0473,
    radiusMeters: 250
  },
  {
    id: 'student-union',
    placeName: 'Student Union',
    address: 'Student Services Centre',
    latitude: -37.7229,
    longitude: 145.0466,
    radiusMeters: 200
  },
  {
    id: 'city-campus',
    placeName: 'City Campus',
    address: 'Melbourne CBD study area',
    latitude: -37.8136,
    longitude: 144.9631,
    radiusMeters: 500
  }
];

const now = new Date();

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    userId: demoUserId,
    title: 'Complete Math Assignment',
    description: 'Finish problem set 4 and submit PDF before the tutorial.',
    subjectId: 'math',
    dueAt: buildISODate(now, 0, 15, 0),
    priority: 'High',
    status: 'pending',
    reminderTime: buildISODate(now, 0, 13, 0),
    locationReminder: campusPlaces[0],
    createdAt: buildISODate(now, -3, 9, 0),
    updatedAt: buildISODate(now, -1, 10, 0)
  },
  {
    id: 'task-2',
    userId: demoUserId,
    title: 'Study for Physics Quiz',
    description: 'Revise motion and force notes. Focus on worked examples.',
    subjectId: 'physics',
    dueAt: buildISODate(now, 0, 17, 0),
    priority: 'Medium',
    status: 'pending',
    createdAt: buildISODate(now, -2, 12, 0),
    updatedAt: buildISODate(now, -1, 18, 0)
  },
  {
    id: 'task-3',
    userId: demoUserId,
    title: 'History Essay Draft',
    description: 'Write first 900 words and add at least three references.',
    subjectId: 'history',
    dueAt: buildISODate(now, 3, 23, 30),
    priority: 'Medium',
    status: 'pending',
    createdAt: buildISODate(now, -5, 14, 0),
    updatedAt: buildISODate(now, -1, 9, 0)
  },
  {
    id: 'task-4',
    userId: demoUserId,
    title: 'Chemistry Lab Report',
    description: 'Format results table and write the discussion section.',
    subjectId: 'chemistry',
    dueAt: buildISODate(now, 5, 16, 0),
    priority: 'High',
    status: 'pending',
    createdAt: buildISODate(now, -4, 11, 0),
    updatedAt: buildISODate(now, -2, 14, 0)
  },
  {
    id: 'task-5',
    userId: demoUserId,
    title: 'Assessment 4 Testing Evidence',
    description: 'Capture Jest test results, device screenshots, and Firebase Test Lab notes.',
    subjectId: 'mobile',
    dueAt: buildISODate(now, 8, 21, 0),
    priority: 'High',
    status: 'pending',
    reminderTime: buildISODate(now, 7, 18, 0),
    createdAt: buildISODate(now, -1, 13, 0),
    updatedAt: buildISODate(now, -1, 13, 0)
  }
];

export const seedStudySessions: StudySession[] = [
  {
    id: 'session-1',
    userId: demoUserId,
    taskId: 'task-1',
    subjectId: 'math',
    startedAt: buildISODate(now, -6, 10, 0),
    endedAt: buildISODate(now, -6, 10, 45),
    durationMinutes: 45,
    note: 'Worked through algebra practice.'
  },
  {
    id: 'session-2',
    userId: demoUserId,
    taskId: 'task-2',
    subjectId: 'physics',
    startedAt: buildISODate(now, -3, 16, 0),
    endedAt: buildISODate(now, -3, 16, 35),
    durationMinutes: 35,
    note: 'Revised quiz notes.'
  },
  {
    id: 'session-3',
    userId: demoUserId,
    taskId: 'task-3',
    subjectId: 'history',
    startedAt: buildISODate(now, -1, 9, 0),
    endedAt: buildISODate(now, -1, 10, 10),
    durationMinutes: 70,
    note: 'Drafted essay outline.'
  }
];

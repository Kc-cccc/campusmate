export const storageKeys = {
  preferences: 'campusmate.preferences',
  user: 'campusmate.user',
  tasks: (userId: string) => `campusmate.tasks.${userId}`,
  tasksInitialized: (userId: string) => `campusmate.tasks.initialized.${userId}`,
  sessions: (userId: string) => `campusmate.sessions.${userId}`,
  sessionsInitialized: (userId: string) => `campusmate.sessions.initialized.${userId}`
};

export const storageKeys = {
  preferences: 'campusmate.preferences',
  user: 'campusmate.user',
  tasks: (userId: string) => `campusmate.tasks.${userId}`,
  sessions: (userId: string) => `campusmate.sessions.${userId}`
};

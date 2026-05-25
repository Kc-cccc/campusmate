import * as SQLite from 'expo-sqlite';

type Database = Awaited<ReturnType<typeof SQLite.openDatabaseAsync>>;

let databasePromise: Promise<Database | null> | null = null;

async function openDatabase(): Promise<Database | null> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('campusmate.db')
      .then(async (db) => {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS app_kv (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            subject_id TEXT NOT NULL,
            due_at TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT NOT NULL,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id, due_at);
          CREATE TABLE IF NOT EXISTS study_sessions (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            task_id TEXT,
            subject_id TEXT,
            started_at TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON study_sessions(user_id, started_at);
        `);
        return db;
      })
      .catch((error: unknown) => {
        console.warn('SQLite unavailable, falling back to AsyncStorage', error);
        return null;
      });
  }

  return databasePromise;
}

export async function loadJsonValue<T>(key: string): Promise<T | null> {
  const db = await openDatabase();
  if (!db) return null;

  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_kv WHERE key = ?', [key]);
  return row ? (JSON.parse(row.value) as T) : null;
}

export async function saveJsonValue<T>(key: string, value: T): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  await db.runAsync(
    'INSERT OR REPLACE INTO app_kv (key, value, updated_at) VALUES (?, ?, ?)',
    [key, JSON.stringify(value), new Date().toISOString()]
  );
  return true;
}

export async function deleteJsonValue(key: string): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  await db.runAsync('DELETE FROM app_kv WHERE key = ?', [key]);
  return true;
}

export async function loadTaskRows<T>(userId: string): Promise<T[] | null> {
  const db = await openDatabase();
  if (!db) return null;

  const rows = await db.getAllAsync<{ payload: string }>(
    'SELECT payload FROM tasks WHERE user_id = ? ORDER BY due_at ASC',
    [userId]
  );
  return rows.map((row) => JSON.parse(row.payload) as T);
}

export async function replaceTaskRows<T extends { id: string; userId: string; title: string; subjectId: string; dueAt: string; status: string; priority: string; updatedAt: string }>(
  userId: string,
  tasks: T[]
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM tasks WHERE user_id = ?', [userId]);
    await Promise.all(tasks.map((task) => db.runAsync(
      `INSERT OR REPLACE INTO tasks
        (id, user_id, title, subject_id, due_at, status, priority, payload, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        userId,
        task.title,
        task.subjectId,
        task.dueAt,
        task.status,
        task.priority,
        JSON.stringify({ ...task, userId }),
        task.updatedAt
      ]
    )));
  });
  return true;
}

export async function deleteTaskRow(taskId: string): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  await db.runAsync('DELETE FROM tasks WHERE id = ?', [taskId]);
  return true;
}

export async function loadSessionRows<T>(userId: string): Promise<T[] | null> {
  const db = await openDatabase();
  if (!db) return null;

  const rows = await db.getAllAsync<{ payload: string }>(
    'SELECT payload FROM study_sessions WHERE user_id = ? ORDER BY started_at DESC',
    [userId]
  );
  return rows.map((row) => JSON.parse(row.payload) as T);
}

export async function replaceSessionRows<T extends { id: string; userId: string; taskId?: string; subjectId?: string; startedAt: string; durationMinutes: number; endedAt: string }>(
  userId: string,
  sessions: T[]
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM study_sessions WHERE user_id = ?', [userId]);
    await Promise.all(sessions.map((session) => db.runAsync(
      `INSERT OR REPLACE INTO study_sessions
        (id, user_id, task_id, subject_id, started_at, duration_minutes, payload, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        userId,
        session.taskId ?? null,
        session.subjectId ?? null,
        session.startedAt,
        session.durationMinutes,
        JSON.stringify({ ...session, userId }),
        session.endedAt
      ]
    )));
  });
  return true;
}

import { validateEmail, validatePassword, validateTask } from '../utils/validation';

describe('validation utilities', () => {
  it('accepts a valid email address', () => {
    expect(validateEmail('student@example.com').isValid).toBe(true);
  });

  it('rejects an invalid email address', () => {
    expect(validateEmail('wrong-email').isValid).toBe(false);
  });

  it('accepts a password with at least six characters', () => {
    expect(validatePassword('123456').isValid).toBe(true);
  });

  it('rejects a short password', () => {
    expect(validatePassword('123').isValid).toBe(false);
  });

  it('accepts a valid task form', () => {
    const result = validateTask({
      title: 'Math assignment',
      description: 'Finish chapter questions',
      subjectId: 'math',
      dueDate: '2026-05-20',
      dueTime: '17:00',
      priority: 'High'
    });

    expect(result.isValid).toBe(true);
  });

  it('rejects a task with a short title', () => {
    const result = validateTask({
      title: 'A',
      description: 'Finish chapter questions',
      subjectId: 'math',
      dueDate: '2026-05-20',
      dueTime: '17:00',
      priority: 'High'
    });

    expect(result.isValid).toBe(false);
  });
});
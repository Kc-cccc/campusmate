import { buildISODate, daysUntil, isoToDateInput, isoToTimeInput, parseDateTimeInput } from '../utils/date';

describe('date utilities', () => {
  it('parses valid date and time input', () => {
    const result = parseDateTimeInput('2026-05-20', '17:30');
    expect(result).not.toBeNull();
    expect(result).toContain('2026-05-20');
  });

  it('rejects invalid date input', () => {
    const result = parseDateTimeInput('wrong-date', '17:30');
    expect(result).toBeNull();
  });

  it('converts ISO date to date input format', () => {
    expect(isoToDateInput('2026-05-20T07:30:00.000Z')).toBe('2026-05-20');
  });

  it('converts ISO date to time input format', () => {
    const result = isoToTimeInput('2026-05-20T07:30:00.000Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('builds an ISO date from a base date', () => {
    const base = new Date('2026-05-20T00:00:00.000Z');
    const result = buildISODate(base, 1, 9, 15);
    expect(result).toContain('2026-05-21');
  });

  it('returns a numeric day difference', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(typeof daysUntil(tomorrow.toISOString())).toBe('number');
  });
});
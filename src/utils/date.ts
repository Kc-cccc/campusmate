export function buildISODate(base: Date, addDays: number, hour: number, minute: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + addDays);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return `${formatShortDate(iso)} · ${formatTime(iso)}`;
}

export function isToday(iso: string): boolean {
  const date = new Date(iso);
  const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(iso);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}

export function parseDateTimeInput(dateInput: string, timeInput: string): string | null {
  const trimmedDate = dateInput.trim();
  const trimmedTime = timeInput.trim();
  const candidate = new Date(`${trimmedDate}T${trimmedTime}:00`);
  if (Number.isNaN(candidate.getTime())) {
    return null;
  }
  return candidate.toISOString();
}

export function isoToDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function isoToTimeInput(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 5);
}

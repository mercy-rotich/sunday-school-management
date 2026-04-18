/** Simulate a network delay (for mock API) */
export function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Deep clone an object */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Generate a UUID v4 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Sum an array of numbers */
export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

/** Get colour for expense category */
export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    supplies: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    snacks: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    events: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    materials: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };
  return map[category] ?? map.other;
}

/** Persist a value to localStorage safely */
export function localSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Retrieve a value from localStorage safely */
export function localGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Remove a value from localStorage safely */
export function localRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

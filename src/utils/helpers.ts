export const createId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export const reorderArray = <T,>(list: T[], start: number, end: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);
  result.splice(end, 0, removed);
  return result;
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.warn('Storage read failed', error);
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage write failed', error);
  }
};

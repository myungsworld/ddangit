import ko from './ko.json';
import en from './en.json';

export type Language = 'ko' | 'en';

export const translations = { ko, en } as const;

export type Translations = typeof ko;

// 중첩 객체에서 값을 가져오는 헬퍼
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
}

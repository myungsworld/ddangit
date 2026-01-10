// Storage 추상화 타입 정의
// Vercel KV, Redis, PostgreSQL, MongoDB 등 어떤 저장소든 교체 가능

export interface RankingEntry {
  rank: number;
  nickname: string;
  score: number;
  gameId: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface DailyRanking {
  gameId: string;
  date: string;
  entries: RankingEntry[];
}

export interface StorageAdapter {
  // 랭킹 관련
  getRanking(gameId: string, date: string): Promise<RankingEntry[]>;
  setRanking(gameId: string, date: string, entries: RankingEntry[]): Promise<void>;

  // 범용 Key-Value
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;

  // 헬스체크
  ping(): Promise<boolean>;
}

// 랭킹 키 생성 유틸
export function rankingKey(gameId: string, date: string): string {
  return `ranking:${gameId}:${date}`;
}

// 오늘 날짜 (YYYY-MM-DD)
export function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

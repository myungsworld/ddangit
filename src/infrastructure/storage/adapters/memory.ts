// In-Memory Adapter (개발/테스트용)
// 서버 재시작 시 데이터 사라짐

import { StorageAdapter, RankingEntry, rankingKey } from '../types';

const store = new Map<string, { value: unknown; expiresAt?: number }>();

export class MemoryAdapter implements StorageAdapter {
  async getRanking(gameId: string, date: string): Promise<RankingEntry[]> {
    const key = rankingKey(gameId, date);
    const entries = await this.get<RankingEntry[]>(key);
    return entries || [];
  }

  async setRanking(gameId: string, date: string, entries: RankingEntry[]): Promise<void> {
    const key = rankingKey(gameId, date);
    await this.set(key, entries, 90000);
  }

  async get<T>(key: string): Promise<T | null> {
    const item = store.get(key);
    if (!item) return null;

    // TTL 체크
    if (item.expiresAt && Date.now() > item.expiresAt) {
      store.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    store.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<boolean> {
    return store.delete(key);
  }

  async ping(): Promise<boolean> {
    return true;
  }

  // 테스트용: 전체 초기화
  clear(): void {
    store.clear();
  }
}

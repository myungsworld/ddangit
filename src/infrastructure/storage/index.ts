// Storage Factory
// STORAGE_TYPE 환경변수로 어댑터 선택
// - memory: 인메모리 (기본값, Docker 개발환경)
// - vercel-kv: Vercel KV (프로덕션)

import { StorageAdapter, RankingEntry, rankingKey } from './types';
import { MemoryAdapter } from './adapters/memory';

let storageInstance: StorageAdapter | null = null;

// Vercel KV 어댑터 (인라인 정의 - @vercel/kv는 런타임에만 로드)
class VercelKVAdapter implements StorageAdapter {
  private kv: unknown = null;

  private async getKV() {
    if (!this.kv) {
      const mod = await import('@vercel/kv');
      this.kv = mod.kv;
    }
    return this.kv as {
      get: <T>(key: string) => Promise<T | null>;
      set: (key: string, value: unknown, options?: { ex?: number }) => Promise<void>;
      del: (key: string) => Promise<number>;
      ping: () => Promise<string>;
    };
  }

  async getRanking(gameId: string, date: string): Promise<RankingEntry[]> {
    const kv = await this.getKV();
    const key = rankingKey(gameId, date);
    const entries = await kv.get<RankingEntry[]>(key);
    return entries || [];
  }

  async setRanking(gameId: string, date: string, entries: RankingEntry[]): Promise<void> {
    const kv = await this.getKV();
    const key = rankingKey(gameId, date);
    await kv.set(key, entries, { ex: 90000 });
  }

  async get<T>(key: string): Promise<T | null> {
    const kv = await this.getKV();
    return kv.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const kv = await this.getKV();
    if (ttlSeconds) {
      await kv.set(key, value, { ex: ttlSeconds });
    } else {
      await kv.set(key, value);
    }
  }

  async delete(key: string): Promise<boolean> {
    const kv = await this.getKV();
    const result = await kv.del(key);
    return result > 0;
  }

  async ping(): Promise<boolean> {
    try {
      const kv = await this.getKV();
      await kv.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export async function getStorage(): Promise<StorageAdapter> {
  if (storageInstance) return storageInstance;

  const storageType = process.env.STORAGE_TYPE || 'memory';

  if (storageType === 'vercel-kv') {
    storageInstance = new VercelKVAdapter();
    console.log('[Storage] Using Vercel KV');
  } else {
    storageInstance = new MemoryAdapter();
    console.log('[Storage] Using in-memory storage');
  }

  return storageInstance;
}

// 타입 재export
export * from './types';

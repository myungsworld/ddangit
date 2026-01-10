// Storage Factory
// STORAGE_TYPE 환경변수로 어댑터 선택
// - memory: 인메모리 (기본값, Docker 개발환경)
// - vercel-kv: Vercel KV (프로덕션)

import { StorageAdapter, RankingEntry, rankingKey } from './types';
import { MemoryAdapter } from './adapters/memory';

let storageInstance: StorageAdapter | null = null;

// Upstash Redis 어댑터 (@upstash/redis 사용)
class UpstashAdapter implements StorageAdapter {
  private redis: unknown = null;

  private async getRedis() {
    if (!this.redis) {
      const { Redis } = await import('@upstash/redis');
      this.redis = new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
      });
      console.log('[Storage] Upstash Redis created with URL:', process.env.KV_REST_API_URL?.slice(0, 30));
    }
    return this.redis as {
      get: <T>(key: string) => Promise<T | null>;
      set: (key: string, value: unknown, options?: { ex?: number }) => Promise<string>;
      del: (key: string) => Promise<number>;
      ping: () => Promise<string>;
    };
  }

  async getRanking(gameId: string, date: string): Promise<RankingEntry[]> {
    const redis = await this.getRedis();
    const key = rankingKey(gameId, date);
    const entries = await redis.get<RankingEntry[]>(key);
    return entries || [];
  }

  async setRanking(gameId: string, date: string, entries: RankingEntry[]): Promise<void> {
    const redis = await this.getRedis();
    const key = rankingKey(gameId, date);
    await redis.set(key, entries, { ex: 90000 });
  }

  async get<T>(key: string): Promise<T | null> {
    const redis = await this.getRedis();
    return redis.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const redis = await this.getRedis();
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds });
    } else {
      await redis.set(key, value);
    }
  }

  async delete(key: string): Promise<boolean> {
    const redis = await this.getRedis();
    const result = await redis.del(key);
    return result > 0;
  }

  async ping(): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      await redis.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export async function getStorage(): Promise<StorageAdapter> {
  if (storageInstance) return storageInstance;

  const storageType = process.env.STORAGE_TYPE || 'memory';
  const hasKVConfig = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  console.log('[Storage] STORAGE_TYPE:', storageType);
  console.log('[Storage] KV configured:', hasKVConfig);

  if (storageType === 'vercel-kv') {
    storageInstance = new UpstashAdapter();
    console.log('[Storage] Using Upstash Redis');
  } else {
    storageInstance = new MemoryAdapter();
    console.log('[Storage] Using in-memory storage');
  }

  return storageInstance;
}

// 타입 재export
export * from './types';

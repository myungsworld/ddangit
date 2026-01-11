// Social Platform Factory

import { Platform, SocialAdapter, PostResult, PostOptions } from './types';
import { TwitterAdapter } from './adapters/twitter';
import { BlueskyAdapter } from './adapters/bluesky';
import { DiscordAdapter } from './adapters/discord';

// 어댑터 레지스트리
const adapters: Record<Platform, () => SocialAdapter> = {
  twitter: () => new TwitterAdapter(),
  bluesky: () => new BlueskyAdapter(),
  discord: () => new DiscordAdapter(),
  reddit: () => { throw new Error('Reddit adapter not implemented'); },
  instagram: () => { throw new Error('Instagram adapter not implemented'); },
};

// 단일 플랫폼 가져오기
export function getSocialAdapter(platform: Platform): SocialAdapter {
  const factory = adapters[platform];
  if (!factory) {
    throw new Error(`Unknown platform: ${platform}`);
  }
  return factory();
}

// 활성화된 모든 플랫폼 가져오기
export function getActiveSocialAdapters(): SocialAdapter[] {
  return Object.values(adapters)
    .map((factory) => {
      try {
        return factory();
      } catch {
        return null;
      }
    })
    .filter((adapter): adapter is SocialAdapter => adapter !== null && adapter.isConfigured());
}

// 모든 활성 플랫폼에 게시
export async function postToAllPlatforms(options: PostOptions): Promise<PostResult[]> {
  const activeAdapters = getActiveSocialAdapters();
  const results = await Promise.all(activeAdapters.map((adapter) => adapter.post(options)));
  return results;
}

// 타입 재export
export * from './types';

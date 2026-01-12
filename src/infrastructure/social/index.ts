// Social Platform Factory

import { Platform, SocialAdapter } from './types';
import { TwitterAdapter } from './adapters/twitter';
import { BlueskyAdapter } from './adapters/bluesky';

// 어댑터 레지스트리
const adapters: Record<Platform, () => SocialAdapter> = {
  twitter: () => new TwitterAdapter(),
  bluesky: () => new BlueskyAdapter(),
};

// 모든 플랫폼 목록 가져오기
export function getAllPlatforms(): Platform[] {
  return Object.keys(adapters) as Platform[];
}

// 단일 플랫폼 가져오기
export function getSocialAdapter(platform: Platform): SocialAdapter {
  const factory = adapters[platform];
  if (!factory) {
    throw new Error(`Unknown platform: ${platform}`);
  }
  return factory();
}

// 타입 재export
export * from './types';

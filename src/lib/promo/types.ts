// 홍보 시스템 공통 타입

export type Platform = 'twitter' | 'reddit' | 'discord';

export type PromoStatus = 'success' | 'failed' | 'skipped';

export interface PromoResult {
  platform: Platform;
  status: PromoStatus;
  message: string;
  postId?: string;
  postUrl?: string;
  timestamp: string;
  error?: string;
}

export interface PromoLog {
  id: string;
  results: PromoResult[];
  content: string;
  createdAt: string;
}

export interface TweetPayload {
  text: string;
}

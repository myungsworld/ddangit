// Social Platform 추상화 타입

export type Platform = 'twitter' | 'discord' | 'reddit' | 'instagram';

export type PostStatus = 'success' | 'failed' | 'skipped';

export interface PostResult {
  platform: Platform;
  status: PostStatus;
  message: string;
  postId?: string;
  postUrl?: string;
  timestamp: string;
  error?: string;
}

export interface PostOptions {
  text: string;
  mediaUrls?: string[];
  tags?: string[];
}

export interface SocialAdapter {
  platform: Platform;

  // 게시물 발행
  post(options: PostOptions): Promise<PostResult>;

  // 연결 확인
  isConfigured(): boolean;
}

// 해시태그 풀 (랜덤 선택용)
export const HASHTAG_POOL = {
  korean: [
    '미니게임',
    '심심풀이',
    '브라우저게임',
    '무료게임',
    '캐주얼게임',
    '반응속도테스트',
    '타자연습',
    '두뇌게임',
    '시간때우기',
  ],
  english: [
    'minigames',
    'browsergames',
    'freegames',
    'casualgames',
    'webgames',
    'indiegames',
    'reactiontest',
    'aimtrainer',
  ],
};

// 랜덤 해시태그 선택
export function pickRandomHashtags(count: number = 3, lang: 'korean' | 'english' = 'english'): string[] {
  const pool = HASHTAG_POOL[lang];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((tag) => `#${tag}`);
}

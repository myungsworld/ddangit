// Social Platform 추상화 타입

export type Platform = 'twitter' | 'bluesky' | 'discord' | 'reddit' | 'instagram';

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
// 트위터는 2-3개 해시태그가 적당 (과하면 스팸으로 인식)
export const HASHTAG_POOL = {
  // 브랜드 태그 (항상 포함)
  brand: ['ddangit', '딴짓'],
  // 한국어 태그 (짧고 자주 검색되는 태그)
  korean: [
    '심심',
    '게임',
    '무료',
    '테트리스',
    '퍼즐',
    '반응속도',
    '시간순삭',
    '꿀잼',
  ],
  // 영어 태그 (짧고 자주 검색되는 태그)
  english: [
    'bored',
    'games',
    'free',
    'tetris',
    'puzzle',
    'fun',
    'play',
    'browser',
  ],
};

// 랜덤 해시태그 선택 (브랜드 태그 + 언어별 태그)
export function pickRandomHashtags(count: number = 2, lang?: 'ko' | 'en'): string[] {
  // 언어 자동 선택 (50/50)
  const selectedLang = lang ?? (Math.random() > 0.5 ? 'ko' : 'en');
  const langKey = selectedLang === 'ko' ? 'korean' : 'english';

  // 브랜드 태그 1개 + 언어별 태그 (count-1)개
  const brandTag = HASHTAG_POOL.brand[selectedLang === 'ko' ? 1 : 0]; // 땅잇 or ddangit
  const pool = HASHTAG_POOL[langKey];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const langTags = shuffled.slice(0, count - 1);

  return [`#${brandTag}`, ...langTags.map(tag => `#${tag}`)];
}

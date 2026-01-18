// 모든 게임이 공유하는 기본 타입 정의

export type GameStatus = 'idle' | 'ready' | 'playing' | 'finished';

export interface GameResult {
  score: number;
  timestamp: Date;
  gameId: string;
}

export interface GameGuide {
  // 기본 정보
  introduction: string; // 게임 소개 (2-3 문장)
  howToPlay: string[];
  scoring: string[];
  tips: string[];
  // 확장 콘텐츠 (AdSense용 800+ 단어)
  history?: string; // 게임 역사/배경
  strategies?: string[]; // 고급 전략
  faq?: { question: string; answer: string }[]; // FAQ
  funFacts?: string[]; // 재미있는 사실
}

export interface GameMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  estimatedTime: string; // e.g., "30초", "1분"
  // SEO 메타데이터 (영어 기본값 - 페이지에서 사용)
  seo: {
    title: string;
    description: string;
  };
  // 게임 가이드 (별도 페이지용)
  guide: GameGuide;
}

export interface GameState<T = unknown> {
  status: GameStatus;
  score: number;
  data: T;
}

// 모든 게임이 공유하는 기본 타입 정의

export type GameStatus = 'idle' | 'ready' | 'playing' | 'finished';

export interface GameResult {
  score: number;
  timestamp: Date;
  gameId: string;
}

export interface GameGuide {
  howToPlay: string[];
  scoring: string[];
  tips: string[];
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

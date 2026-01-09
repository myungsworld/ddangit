// 모든 게임이 공유하는 기본 타입 정의

export type GameStatus = 'idle' | 'ready' | 'playing' | 'finished';

export interface GameResult {
  score: number;
  timestamp: Date;
  gameId: string;
}

export interface GameMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  estimatedTime: string; // e.g., "30초", "1분"
}

export interface GameState<T = unknown> {
  status: GameStatus;
  score: number;
  data: T;
}

// 랭킹 서비스 타입

export interface ScoreSubmission {
  gameId: string;
  score: number;
  nickname?: string;
}

export interface RankCheckResult {
  isTopRank: boolean;
  rank: number | null; // 1, 2, 3 또는 null (랭크 아님)
  currentTop3: RankEntry[];
}

export interface RankEntry {
  rank: number;
  nickname: string;
  score: number;
  createdAt: string;
}

export interface SubmitResult {
  success: boolean;
  rank: number | null;
  message: string;
}

// 게임별 점수 비교 방식 (높을수록 좋은지, 낮을수록 좋은지)
export type ScoreOrder = 'asc' | 'desc';

export const GAME_SCORE_ORDER: Record<string, ScoreOrder> = {
  'reaction-speed': 'asc',   // 낮을수록 좋음 (ms)
  'aim-trainer': 'asc',      // 낮을수록 좋음 (ms)
  'number-memory': 'desc',   // 높을수록 좋음 (레벨)
  'typing-speed': 'desc',    // 높을수록 좋음 (WPM)
  'sand-tetris': 'desc',     // 높을수록 좋음 (점수)
};

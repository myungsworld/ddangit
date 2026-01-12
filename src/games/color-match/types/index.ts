// 게임 단계
export type GamePhase = 'ready' | 'playing' | 'ending' | 'gameover';

// 색상 정의
export interface ColorDef {
  id: string;
  name: {
    ko: string;
    en: string;
  };
  hex: string;
}

// 문제 정의
export interface Question {
  text: string;       // 표시할 텍스트 (색상 이름)
  textColor: ColorDef; // 실제 글자색 (정답)
  displayColor: ColorDef; // 텍스트 내용의 색상
}

// 게임 상태
export interface GameState {
  phase: GamePhase;
  score: number;
  highScore: number;
  streak: number;      // 연속 정답
  bestStreak: number;
  timeLeft: number;    // 남은 시간 (초)
  currentQuestion: Question | null;
  options: ColorDef[]; // 선택지
  lastAnswer: 'correct' | 'wrong' | null;
  showTimeBonus: boolean;  // 시간 보너스 표시
  showTimePenalty: boolean; // 시간 감소 표시
  combo: number;       // 현재 콤보 (5연속마다 보너스)
}

// 게임 데이터 (결과 화면용)
export interface GameData {
  score: number;
  highScore: number;
  bestStreak: number;
}

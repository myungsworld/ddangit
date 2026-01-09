// 타이핑 속도 게임 타입 정의

export type TypingGamePhase = 'idle' | 'playing' | 'result';

export interface TypingGameData {
  phase: TypingGamePhase;
  text: string;           // 타이핑할 텍스트
  userInput: string;      // 유저 입력
  startTime: number | null;
  endTime: number | null;
  errors: number;         // 오타 수
}

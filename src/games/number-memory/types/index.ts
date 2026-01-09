// 숫자 기억 게임 타입 정의

export type MemoryGamePhase = 'idle' | 'showing' | 'input' | 'correct' | 'wrong' | 'result';

export interface MemoryGameData {
  phase: MemoryGamePhase;
  level: number;           // 현재 레벨 (= 숫자 자릿수)
  currentNumber: string;   // 현재 보여주는 숫자
  userInput: string;       // 유저 입력
  highestLevel: number;    // 최고 기록
}

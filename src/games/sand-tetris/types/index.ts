// 샌드 테트리스 타입 정의

export type GamePhase = 'idle' | 'playing' | 'clearing' | 'gameover';

// 셀 타입: 0 = 빈 공간, 1~5 = 모래 (색상 인덱스)
export type Cell = number;

// 테트리스 블록 모양
export type BlockShape = number[][];

// 현재 떨어지는 블록
export interface FallingBlock {
  shape: BlockShape;
  x: number;       // 픽셀 좌표
  y: number;       // 픽셀 좌표
  colorIndex: number;  // 1~5
}

// 삭제될 픽셀 좌표
export type ClearingPixel = [number, number]; // [y, x]

export interface GameState {
  phase: GamePhase;
  grid: Cell[][];
  currentBlock: FallingBlock | null;
  score: number;
  clearingPixels: ClearingPixel[];  // 현재 삭제 애니메이션 중인 픽셀들
  clearingFrame: number;            // 애니메이션 프레임 (깜빡임용)
}

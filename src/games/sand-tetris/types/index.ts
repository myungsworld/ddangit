// 샌드 테트리스 타입 정의

export type SandGamePhase = 'idle' | 'playing' | 'paused' | 'gameover';

// 셀 타입: 0 = 빈 공간, 1+ = 모래 (색상 인덱스)
export type Cell = number;

// 테트리스 블록 모양
export type BlockShape = number[][];

// 현재 떨어지는 블록
export interface FallingBlock {
  shape: BlockShape;
  x: number;
  y: number;
  colorIndex: number;
}

export interface SandGameState {
  phase: SandGamePhase;
  grid: Cell[][];           // 모래 그리드
  currentBlock: FallingBlock | null;
  nextBlock: BlockShape;
  score: number;
  level: number;
  linesCleared: number;
}

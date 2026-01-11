// 게임 단계
export type GamePhase = 'ready' | 'playing' | 'ending' | 'gameover';

// 그리드 셀 상태
export interface Cell {
  filled: boolean;
  color: string | null;
}

// 블록 모양 정의
export interface BlockShape {
  id: string;
  shape: boolean[][];  // 2D 배열로 블록 모양 표현
  color: string;
}

// 드래그 중인 블록 정보
export interface DraggingBlock {
  shapeIndex: number;  // 현재 블록 슬롯 인덱스 (0, 1, 2)
  shape: BlockShape;
  offsetX: number;
  offsetY: number;
}

// 미리보기 위치
export interface PreviewPosition {
  row: number;
  col: number;
  valid: boolean;
}

// 게임 상태
export interface GameState {
  phase: GamePhase;
  grid: Cell[][];
  currentBlocks: (BlockShape | null)[];  // 3개의 블록 슬롯
  score: number;
  highScore: number;
  combo: number;
  dragging: DraggingBlock | null;
  preview: PreviewPosition | null;
}

// 게임 액션
export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  startDrag: (shapeIndex: number, offsetX: number, offsetY: number) => void;
  updateDrag: (clientX: number, clientY: number) => void;
  endDrag: () => void;
  placeBlock: (row: number, col: number) => boolean;
}

// 게임 데이터 (결과 화면용)
export interface GameData {
  score: number;
  highScore: number;
}

// 샌드 테트리스 설정
import { BlockShape } from "../types";

export const GAME_CONFIG = {
  id: "sand-tetris",
  name: "Sand Tetris",
  color: "#D97706",

  // 그리드 크기 (픽셀 단위)
  GRID_WIDTH: 80,
  GRID_HEIGHT: 120,

  // 블록 크기 (픽셀 단위, 블록 1칸 = 6픽셀)
  BLOCK_SIZE: 6,

  // 게임 속도
  DROP_INTERVAL: 400, // 블록 떨어지는 간격 (ms)
  SAND_UPDATE_INTERVAL: 20, // 모래 물리 업데이트 간격 (ms)

  // 위험선 (상단 5%)
  DANGER_ZONE_RATIO: 0.05,

  // 점수 계산
  SCORE_DIVISOR: 1, // 클리어된 픽셀 / N = 점수
};

// 테트리스 블록 모양들 (1칸 = BLOCK_SIZE 픽셀)
export const BLOCK_SHAPES: BlockShape[] = [
  // I
  [[1, 1, 1, 1]],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

// 모든 색상 (레벨에 따라 순차적으로 해금)
export const BLOCK_COLORS = [
  "#FF4757", // 빨강
  "#FFA502", // 주황
  "#2ED573", // 초록
  "#3742FA", // 파랑
  "#A55EEA", // 보라
];

// 레벨 설정 (확장 가능)
export interface LevelConfig {
  minScore: number; // 이 레벨에 도달하는 최소 점수
  colorCount: number; // 사용 가능한 색상 수
}

export const LEVELS: LevelConfig[] = [
  { minScore: 0, colorCount: 3 }, // 시작: 3색
  { minScore: 5000, colorCount: 4 }, // x점: 4색
  { minScore: 20000, colorCount: 5 }, // x점: 5색
];

// 현재 레벨 인덱스 계산
export function getLevelIndex(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return i;
  }
  return 0;
}

// 현재 레벨 설정 가져오기
export function getLevel(score: number): LevelConfig {
  return LEVELS[getLevelIndex(score)];
}

// 점수에 따른 사용 가능한 색상 수
export function getColorCount(score: number): number {
  return getLevel(score).colorCount;
}

// 랜덤 블록 생성 (점수에 따라 색상 수 결정)
export function getRandomBlock(score: number = 0): {
  shape: BlockShape;
  colorIndex: number;
} {
  const shapeIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
  const colorCount = getColorCount(score);
  const colorIndex = Math.floor(Math.random() * colorCount) + 1;
  return {
    shape: BLOCK_SHAPES[shapeIndex],
    colorIndex,
  };
}

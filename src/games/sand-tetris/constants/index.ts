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

  // 위험선 (상단 20%)
  DANGER_ZONE_RATIO: 0.2,

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

// 기본 4가지 색상 + 추가 색상
export const BLOCK_COLORS = [
  "#FF4757", // 빨강
  "#FFA502", // 주황
  "#2ED573", // 초록
  "#3742FA", // 파랑
  "#A55EEA", // 보라 (레벨업 시 추가)
];

// 레벨업 점수 기준
export const LEVEL_UP_SCORE = 1000;

// 점수에 따른 사용 가능한 색상 수
export function getColorCount(score: number): number {
  return score >= LEVEL_UP_SCORE ? 5 : 4;
}

// 랜덤 블록 생성 (점수에 따라 색상 수 결정)
export function getRandomBlock(score: number = 0): {
  shape: BlockShape;
  colorIndex: number;
} {
  const shapeIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
  const colorCount = getColorCount(score);
  const colorIndex = Math.floor(Math.random() * colorCount) + 1; // 1~ (0은 빈 공간)
  return {
    shape: BLOCK_SHAPES[shapeIndex],
    colorIndex,
  };
}

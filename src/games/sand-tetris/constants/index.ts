// 샌드 테트리스 설정
import { BlockShape } from '../types';

export const GAME_CONFIG = {
  id: 'sand-tetris',
  name: 'Sand Tetris',
  color: '#D97706',

  // 그리드 크기 (픽셀 단위)
  GRID_WIDTH: 100,
  GRID_HEIGHT: 150,

  // 블록 크기 (픽셀 단위, 블록 1칸 = 10픽셀)
  BLOCK_SIZE: 10,

  // 게임 속도
  INITIAL_DROP_INTERVAL: 500,  // ms
  SAND_UPDATE_INTERVAL: 16,    // ms (약 60fps)

  // 점수
  SCORE_PER_LINE: 100,
};

// 테트리스 블록 모양들 (1칸 = BLOCK_SIZE 픽셀)
export const BLOCK_SHAPES: BlockShape[] = [
  // I
  [[1, 1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
];

// 블록 색상들
export const BLOCK_COLORS = [
  '#EF4444', // 빨강
  '#F59E0B', // 주황
  '#EAB308', // 노랑
  '#22C55E', // 초록
  '#06B6D4', // 청록
  '#3B82F6', // 파랑
  '#8B5CF6', // 보라
];

// 랜덤 블록 생성
export function getRandomBlock(): { shape: BlockShape; colorIndex: number } {
  const shapeIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
  const colorIndex = Math.floor(Math.random() * BLOCK_COLORS.length) + 1; // 1부터 시작 (0은 빈 공간)
  return {
    shape: BLOCK_SHAPES[shapeIndex],
    colorIndex,
  };
}

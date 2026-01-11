import { BlockShape } from '../types';

// 게임 설정
export const GAME_CONFIG = {
  id: 'block-blast',
  name: 'Block Blast',
  color: '#8B5CF6', // 보라색
};

// 그리드 설정
export const GRID_SIZE = 8;
export const CELL_SIZE = 40; // 픽셀

// 블록 색상
export const BLOCK_COLORS = [
  '#EF4444', // 빨강
  '#F97316', // 주황
  '#EAB308', // 노랑
  '#22C55E', // 초록
  '#3B82F6', // 파랑
  '#8B5CF6', // 보라
  '#EC4899', // 분홍
  '#06B6D4', // 청록
];

// 블록 모양 정의
export const BLOCK_SHAPES: Omit<BlockShape, 'color'>[] = [
  // 1x1 단일 블록
  { id: 'single', shape: [[true]] },

  // 1x2 가로
  { id: 'h2', shape: [[true, true]] },

  // 2x1 세로
  { id: 'v2', shape: [[true], [true]] },

  // 1x3 가로
  { id: 'h3', shape: [[true, true, true]] },

  // 3x1 세로
  { id: 'v3', shape: [[true], [true], [true]] },

  // 1x4 가로
  { id: 'h4', shape: [[true, true, true, true]] },

  // 4x1 세로
  { id: 'v4', shape: [[true], [true], [true], [true]] },

  // 1x5 가로
  { id: 'h5', shape: [[true, true, true, true, true]] },

  // 5x1 세로
  { id: 'v5', shape: [[true], [true], [true], [true], [true]] },

  // 2x2 정사각형
  { id: 'square2', shape: [[true, true], [true, true]] },

  // 3x3 정사각형
  { id: 'square3', shape: [[true, true, true], [true, true, true], [true, true, true]] },

  // L자 블록들
  { id: 'L1', shape: [[true, false], [true, false], [true, true]] },
  { id: 'L2', shape: [[true, true, true], [true, false, false]] },
  { id: 'L3', shape: [[true, true], [false, true], [false, true]] },
  { id: 'L4', shape: [[false, false, true], [true, true, true]] },

  // 역L자 블록들
  { id: 'J1', shape: [[false, true], [false, true], [true, true]] },
  { id: 'J2', shape: [[true, false, false], [true, true, true]] },
  { id: 'J3', shape: [[true, true], [true, false], [true, false]] },
  { id: 'J4', shape: [[true, true, true], [false, false, true]] },

  // T자 블록
  { id: 'T1', shape: [[true, true, true], [false, true, false]] },
  { id: 'T2', shape: [[true, false], [true, true], [true, false]] },
  { id: 'T3', shape: [[false, true, false], [true, true, true]] },
  { id: 'T4', shape: [[false, true], [true, true], [false, true]] },

  // Z자 블록
  { id: 'Z1', shape: [[true, true, false], [false, true, true]] },
  { id: 'Z2', shape: [[false, true], [true, true], [true, false]] },

  // S자 블록
  { id: 'S1', shape: [[false, true, true], [true, true, false]] },
  { id: 'S2', shape: [[true, false], [true, true], [false, true]] },
];

// 점수 설정
export const SCORE_CONFIG = {
  blockPlace: 10,      // 블록 배치당 기본 점수
  lineClear: 100,      // 줄 클리어당 점수
  comboMultiplier: 50, // 콤보당 추가 점수
};

// 랜덤 블록 생성
export function getRandomBlock(): BlockShape {
  const shapeTemplate = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
  const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];

  return {
    ...shapeTemplate,
    color,
  };
}

// 블록 크기 계산 (셀 개수)
export function getBlockSize(shape: boolean[][]): number {
  return shape.reduce((total, row) =>
    total + row.filter(cell => cell).length, 0
  );
}

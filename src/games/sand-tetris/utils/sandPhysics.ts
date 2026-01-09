// 모래 물리 시뮬레이션 (개선 버전)
import { Cell } from '../types';
import { GAME_CONFIG } from '../constants';

const { GRID_WIDTH, GRID_HEIGHT } = GAME_CONFIG;

// 빈 그리드 생성
export function createEmptyGrid(): Cell[][] {
  return Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(0));
}

// 모래 물리 업데이트 (한 프레임)
// 여러 번 반복해서 더 자연스러운 물리 구현
export function updateSandPhysics(grid: Cell[][], iterations: number = 3): Cell[][] {
  let currentGrid = grid;

  for (let i = 0; i < iterations; i++) {
    currentGrid = updateSandPhysicsOnce(currentGrid);
  }

  return currentGrid;
}

// 모래 물리 업데이트 (1회)
function updateSandPhysicsOnce(grid: Cell[][]): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  // 아래에서 위로 순회 (맨 아래 줄은 제외)
  for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
    // 좌우 랜덤 순회 (균형을 위해)
    const goLeft = Math.random() > 0.5;

    for (let i = 0; i < GRID_WIDTH; i++) {
      const x = goLeft ? i : GRID_WIDTH - 1 - i;
      const cell = newGrid[y][x];

      // 빈 공간이면 스킵
      if (cell === 0) continue;

      // 아래가 비어있으면 떨어짐
      if (newGrid[y + 1][x] === 0) {
        newGrid[y + 1][x] = cell;
        newGrid[y][x] = 0;
        continue;
      }

      // 좌우 랜덤 선택
      const tryLeft = Math.random() > 0.5;

      if (tryLeft) {
        // 좌하단 시도
        if (x > 0 && newGrid[y + 1][x - 1] === 0) {
          newGrid[y + 1][x - 1] = cell;
          newGrid[y][x] = 0;
          continue;
        }
        // 우하단 시도
        if (x < GRID_WIDTH - 1 && newGrid[y + 1][x + 1] === 0) {
          newGrid[y + 1][x + 1] = cell;
          newGrid[y][x] = 0;
          continue;
        }
      } else {
        // 우하단 시도
        if (x < GRID_WIDTH - 1 && newGrid[y + 1][x + 1] === 0) {
          newGrid[y + 1][x + 1] = cell;
          newGrid[y][x] = 0;
          continue;
        }
        // 좌하단 시도
        if (x > 0 && newGrid[y + 1][x - 1] === 0) {
          newGrid[y + 1][x - 1] = cell;
          newGrid[y][x] = 0;
          continue;
        }
      }
    }
  }

  return newGrid;
}

// 라인 클리어 체크 및 처리
export function checkAndClearLines(grid: Cell[][]): { newGrid: Cell[][]; linesCleared: number } {
  let linesCleared = 0;
  const newGrid = grid.map(row => [...row]);

  // 아래에서 위로 체크
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    // 한 줄이 90% 이상 채워졌는지 확인 (완전히 꽉 차지 않아도 클리어)
    const filledCount = newGrid[y].filter(cell => cell !== 0).length;
    const fillRatio = filledCount / GRID_WIDTH;

    if (fillRatio >= 0.9) {
      linesCleared++;
      // 해당 줄 제거하고 맨 위에 빈 줄 추가
      newGrid.splice(y, 1);
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
      // 같은 y 다시 체크
      y++;
    }
  }

  return { newGrid, linesCleared };
}

// 게임 오버 체크 (상단 영역에 모래가 있으면)
export function checkGameOver(grid: Cell[][]): boolean {
  // 상단 10% 영역 체크
  const dangerZone = Math.floor(GRID_HEIGHT * 0.1);

  for (let y = 0; y < dangerZone; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] !== 0) {
        return true;
      }
    }
  }

  return false;
}

// 블록을 모래로 변환 (그리드에 추가)
export function convertBlockToSand(
  grid: Cell[][],
  shape: number[][],
  blockX: number,
  blockY: number,
  colorIndex: number,
  blockSize: number
): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  // 블록의 각 칸을 모래 픽셀로 변환
  for (let sy = 0; sy < shape.length; sy++) {
    for (let sx = 0; sx < shape[sy].length; sx++) {
      if (shape[sy][sx] === 0) continue;

      // 블록 1칸 = blockSize x blockSize 픽셀
      const startX = blockX + sx * blockSize;
      const startY = blockY + sy * blockSize;

      for (let py = 0; py < blockSize; py++) {
        for (let px = 0; px < blockSize; px++) {
          const gridX = startX + px;
          const gridY = startY + py;

          if (
            gridX >= 0 && gridX < GRID_WIDTH &&
            gridY >= 0 && gridY < GRID_HEIGHT
          ) {
            newGrid[gridY][gridX] = colorIndex;
          }
        }
      }
    }
  }

  return newGrid;
}

// 블록 충돌 체크
export function checkCollision(
  grid: Cell[][],
  shape: number[][],
  blockX: number,
  blockY: number,
  blockSize: number
): boolean {
  for (let sy = 0; sy < shape.length; sy++) {
    for (let sx = 0; sx < shape[sy].length; sx++) {
      if (shape[sy][sx] === 0) continue;

      const startX = blockX + sx * blockSize;
      const bottomY = blockY + (sy + 1) * blockSize;

      for (let px = 0; px < blockSize; px++) {
        const gridX = startX + px;

        // 바닥 충돌
        if (bottomY >= GRID_HEIGHT) {
          return true;
        }

        // 그리드 범위 체크
        if (gridX < 0 || gridX >= GRID_WIDTH) {
          return true;
        }

        // 모래와 충돌 (블록 아래쪽 픽셀들만)
        if (bottomY >= 0 && bottomY < GRID_HEIGHT && grid[bottomY][gridX] !== 0) {
          return true;
        }
      }
    }
  }

  return false;
}

// 좌우 이동 가능 체크
export function canMove(
  grid: Cell[][],
  shape: number[][],
  blockX: number,
  blockY: number,
  blockSize: number,
  dx: number
): boolean {
  const newX = blockX + dx;

  for (let sy = 0; sy < shape.length; sy++) {
    for (let sx = 0; sx < shape[sy].length; sx++) {
      if (shape[sy][sx] === 0) continue;

      const pixelX = newX + sx * blockSize;
      const pixelY = blockY + sy * blockSize;

      // 좌우 벽 체크
      if (pixelX < 0 || pixelX + blockSize > GRID_WIDTH) {
        return false;
      }

      // 모래와 충돌 체크
      for (let py = 0; py < blockSize; py++) {
        for (let px = 0; px < blockSize; px++) {
          const checkX = pixelX + px;
          const checkY = pixelY + py;

          if (
            checkY >= 0 && checkY < GRID_HEIGHT &&
            checkX >= 0 && checkX < GRID_WIDTH &&
            grid[checkY][checkX] !== 0
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

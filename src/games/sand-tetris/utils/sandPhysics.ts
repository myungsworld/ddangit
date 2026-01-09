// 모래 물리 시뮬레이션
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
// 아래에서 위로 순회해야 모래가 자연스럽게 떨어짐
export function updateSandPhysics(grid: Cell[][]): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  // 아래에서 위로 순회 (맨 아래 줄은 제외)
  for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
    // 랜덤 방향으로 순회 (좌우 균형을 위해)
    const startX = Math.random() > 0.5 ? 0 : GRID_WIDTH - 1;
    const endX = startX === 0 ? GRID_WIDTH : -1;
    const step = startX === 0 ? 1 : -1;

    for (let x = startX; x !== endX; x += step) {
      const cell = newGrid[y][x];

      // 빈 공간이면 스킵
      if (cell === 0) continue;

      // 아래가 비어있으면 떨어짐
      if (newGrid[y + 1][x] === 0) {
        newGrid[y + 1][x] = cell;
        newGrid[y][x] = 0;
        continue;
      }

      // 좌하단이 비어있으면 떨어짐
      if (x > 0 && newGrid[y + 1][x - 1] === 0) {
        newGrid[y + 1][x - 1] = cell;
        newGrid[y][x] = 0;
        continue;
      }

      // 우하단이 비어있으면 떨어짐
      if (x < GRID_WIDTH - 1 && newGrid[y + 1][x + 1] === 0) {
        newGrid[y + 1][x + 1] = cell;
        newGrid[y][x] = 0;
        continue;
      }
    }
  }

  return newGrid;
}

// 라인 클리어 체크 및 처리
export function checkAndClearLines(grid: Cell[][]): { newGrid: Cell[][]; linesCleared: number } {
  let linesCleared = 0;
  const newGrid = [...grid];

  // 아래에서 위로 체크
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    // 한 줄이 모두 채워졌는지 확인
    const isFull = newGrid[y].every(cell => cell !== 0);

    if (isFull) {
      linesCleared++;
      // 해당 줄 제거하고 맨 위에 빈 줄 추가
      newGrid.splice(y, 1);
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
      // 같은 y 다시 체크 (위에서 내려온 줄)
      y++;
    }
  }

  return { newGrid, linesCleared };
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

      // 블록 1칸의 맨 아래 픽셀들만 체크
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

        // 모래와 충돌
        if (bottomY >= 0 && grid[bottomY][gridX] !== 0) {
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
  direction: 'left' | 'right'
): boolean {
  const dx = direction === 'left' ? -blockSize : blockSize;
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

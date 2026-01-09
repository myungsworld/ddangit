// 모래 물리 시뮬레이션
import { Cell, ClearingPixel } from '../types';
import { GAME_CONFIG, BLOCK_COLORS } from '../constants';

const { GRID_WIDTH, GRID_HEIGHT, DANGER_ZONE_RATIO } = GAME_CONFIG;

// 빈 그리드 생성
export function createEmptyGrid(): Cell[][] {
  return Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(0));
}

// 모래 물리 업데이트 (한 프레임)
export function updateSandPhysics(grid: Cell[][]): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  // 아래에서 위로 순회 (맨 아래 줄은 제외)
  for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
    const startLeft = Math.random() > 0.5;

    for (let i = 0; i < GRID_WIDTH; i++) {
      const x = startLeft ? i : GRID_WIDTH - 1 - i;
      const cell = newGrid[y][x];

      if (cell === 0) continue;

      // 아래가 비어있으면 떨어짐
      if (newGrid[y + 1][x] === 0) {
        newGrid[y + 1][x] = cell;
        newGrid[y][x] = 0;
        continue;
      }

      // 좌하단 또는 우하단으로 굴러감
      const tryLeft = Math.random() > 0.5;

      if (tryLeft) {
        if (x > 0 && newGrid[y + 1][x - 1] === 0) {
          newGrid[y + 1][x - 1] = cell;
          newGrid[y][x] = 0;
        } else if (x < GRID_WIDTH - 1 && newGrid[y + 1][x + 1] === 0) {
          newGrid[y + 1][x + 1] = cell;
          newGrid[y][x] = 0;
        }
      } else {
        if (x < GRID_WIDTH - 1 && newGrid[y + 1][x + 1] === 0) {
          newGrid[y + 1][x + 1] = cell;
          newGrid[y][x] = 0;
        } else if (x > 0 && newGrid[y + 1][x - 1] === 0) {
          newGrid[y + 1][x - 1] = cell;
          newGrid[y][x] = 0;
        }
      }
    }
  }

  return newGrid;
}

// BFS로 같은 색 연결 탐색 (왼쪽 벽 → 오른쪽 벽)
function findConnectedPixels(grid: Cell[][], startY: number, colorIndex: number): ClearingPixel[] {
  const visited = new Set<string>();
  const connected: ClearingPixel[] = [];
  const queue: ClearingPixel[] = [];

  if (grid[startY][0] !== colorIndex) return [];

  queue.push([startY, 0]);
  visited.add(`${startY},0`);

  let reachedRight = false;

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  while (queue.length > 0) {
    const [y, x] = queue.shift()!;
    connected.push([y, x]);

    if (x === GRID_WIDTH - 1) {
      reachedRight = true;
    }

    for (const [dy, dx] of directions) {
      const ny = y + dy;
      const nx = x + dx;
      const key = `${ny},${nx}`;

      if (
        ny >= 0 && ny < GRID_HEIGHT &&
        nx >= 0 && nx < GRID_WIDTH &&
        !visited.has(key) &&
        grid[ny][nx] === colorIndex
      ) {
        visited.add(key);
        queue.push([ny, nx]);
      }
    }
  }

  return reachedRight ? connected : [];
}

// 클리어할 픽셀들 찾기 (삭제하지 않고 좌표만 반환)
export function findPixelsToClear(grid: Cell[][]): ClearingPixel[] {
  const allPixels: ClearingPixel[] = [];
  const colorCount = BLOCK_COLORS.length;

  for (let colorIndex = 1; colorIndex <= colorCount; colorIndex++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (grid[y][0] === colorIndex) {
        const connected = findConnectedPixels(grid, y, colorIndex);
        if (connected.length > 0) {
          allPixels.push(...connected);
        }
      }
    }
  }

  return allPixels;
}

// 픽셀들 실제로 삭제
export function clearPixels(grid: Cell[][], pixels: ClearingPixel[]): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  for (const [y, x] of pixels) {
    newGrid[y][x] = 0;
  }

  return newGrid;
}

// 블록을 모래로 변환
export function convertBlockToSand(
  grid: Cell[][],
  shape: number[][],
  blockX: number,
  blockY: number,
  colorIndex: number,
  blockSize: number
): Cell[][] {
  const newGrid = grid.map(row => [...row]);

  for (let sy = 0; sy < shape.length; sy++) {
    for (let sx = 0; sx < shape[sy].length; sx++) {
      if (shape[sy][sx] === 0) continue;

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

        if (bottomY >= GRID_HEIGHT) return true;
        if (gridX < 0 || gridX >= GRID_WIDTH) return true;

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

      if (pixelX < 0 || pixelX + blockSize > GRID_WIDTH) return false;

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

// 게임 오버 체크
export function checkGameOver(grid: Cell[][]): boolean {
  const dangerLine = Math.floor(GRID_HEIGHT * DANGER_ZONE_RATIO);

  for (let y = 0; y < dangerLine; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] !== 0) {
        return true;
      }
    }
  }

  return false;
}

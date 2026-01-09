'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SandGameState, FallingBlock } from '../types';
import { GAME_CONFIG, getRandomBlock } from '../constants';
import {
  createEmptyGrid,
  updateSandPhysics,
  checkAndClearLines,
  convertBlockToSand,
  checkCollision,
  canMove,
  checkGameOver,
} from '../utils/sandPhysics';

const { GRID_WIDTH, BLOCK_SIZE, INITIAL_DROP_INTERVAL, SAND_UPDATE_INTERVAL, SCORE_PER_LINE } = GAME_CONFIG;

const initialState: SandGameState = {
  phase: 'idle',
  grid: createEmptyGrid(),
  currentBlock: null,
  nextBlock: [],
  score: 0,
  level: 1,
  linesCleared: 0,
};

export function useSandTetris() {
  const [state, setState] = useState<SandGameState>(initialState);
  const sandLoopRef = useRef<number | null>(null);
  const dropLoopRef = useRef<number | null>(null);
  const lastDropTimeRef = useRef<number>(0);
  const gameOverCheckRef = useRef<number>(0);

  // 새 블록 생성
  const spawnBlock = useCallback((): FallingBlock => {
    const { shape, colorIndex } = getRandomBlock();
    const blockWidth = shape[0].length * BLOCK_SIZE;
    return {
      shape,
      colorIndex,
      x: Math.floor((GRID_WIDTH - blockWidth) / 2),
      y: 0,
    };
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    const { shape: nextShape } = getRandomBlock();
    setState({
      phase: 'playing',
      grid: createEmptyGrid(),
      currentBlock: spawnBlock(),
      nextBlock: nextShape,
      score: 0,
      level: 1,
      linesCleared: 0,
    });
  }, [spawnBlock]);

  // 블록 고정 (모래로 변환)
  const lockBlock = useCallback(() => {
    setState((prev) => {
      if (!prev.currentBlock || prev.phase !== 'playing') return prev;

      // 블록을 모래로 변환
      let newGrid = convertBlockToSand(
        prev.grid,
        prev.currentBlock.shape,
        prev.currentBlock.x,
        prev.currentBlock.y,
        prev.currentBlock.colorIndex,
        BLOCK_SIZE
      );

      // 라인 클리어 체크
      const { newGrid: clearedGrid, linesCleared } = checkAndClearLines(newGrid);
      newGrid = clearedGrid;

      const newScore = prev.score + linesCleared * SCORE_PER_LINE;
      const newTotalLines = prev.linesCleared + linesCleared;
      const newLevel = Math.floor(newTotalLines / 10) + 1;

      // 새 블록 생성
      const { shape, colorIndex } = getRandomBlock();
      const blockWidth = prev.nextBlock[0]?.length * BLOCK_SIZE || BLOCK_SIZE;
      const newBlock: FallingBlock = {
        shape: prev.nextBlock,
        colorIndex,
        x: Math.floor((GRID_WIDTH - blockWidth) / 2),
        y: 0,
      };

      return {
        ...prev,
        grid: newGrid,
        currentBlock: newBlock,
        nextBlock: shape,
        score: newScore,
        level: newLevel,
        linesCleared: newTotalLines,
      };
    });
  }, []);

  // 블록 이동 (터치 위치 기반)
  const moveBlockTo = useCallback((targetX: number) => {
    setState((prev) => {
      if (prev.phase !== 'playing' || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      const blockCenterX = block.x + (block.shape[0].length * BLOCK_SIZE) / 2;

      // 타겟 방향으로 한 칸씩 이동
      let newX = block.x;
      const step = BLOCK_SIZE;

      if (targetX < blockCenterX - step / 2) {
        // 왼쪽으로 이동
        if (canMove(prev.grid, block.shape, block.x, block.y, BLOCK_SIZE, -step)) {
          newX = block.x - step;
        }
      } else if (targetX > blockCenterX + step / 2) {
        // 오른쪽으로 이동
        if (canMove(prev.grid, block.shape, block.x, block.y, BLOCK_SIZE, step)) {
          newX = block.x + step;
        }
      }

      if (newX !== block.x) {
        return {
          ...prev,
          currentBlock: { ...block, x: newX },
        };
      }

      return prev;
    });
  }, []);

  // 블록 회전
  const rotateBlock = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'playing' || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      const rows = block.shape.length;
      const cols = block.shape[0].length;

      // 90도 회전
      const rotated: number[][] = [];
      for (let x = 0; x < cols; x++) {
        const newRow: number[] = [];
        for (let y = rows - 1; y >= 0; y--) {
          newRow.push(block.shape[y][x]);
        }
        rotated.push(newRow);
      }

      // 회전 후 충돌 체크
      if (!checkCollision(prev.grid, rotated, block.x, block.y, BLOCK_SIZE)) {
        return {
          ...prev,
          currentBlock: { ...block, shape: rotated },
        };
      }

      return prev;
    });
  }, []);

  // 하드 드롭
  const hardDrop = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'playing' || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      let newY = block.y;

      // 충돌할 때까지 아래로
      while (!checkCollision(prev.grid, block.shape, block.x, newY + BLOCK_SIZE, BLOCK_SIZE)) {
        newY += BLOCK_SIZE;
      }

      return {
        ...prev,
        currentBlock: { ...block, y: newY },
      };
    });

    // 바로 고정
    setTimeout(lockBlock, 0);
  }, [lockBlock]);

  // 리셋
  const reset = useCallback(() => {
    if (sandLoopRef.current) cancelAnimationFrame(sandLoopRef.current);
    if (dropLoopRef.current) cancelAnimationFrame(dropLoopRef.current);
    setState(initialState);
  }, []);

  // 모래 물리 루프
  useEffect(() => {
    if (state.phase !== 'playing') return;

    let lastTime = 0;

    const sandLoop = (time: number) => {
      if (time - lastTime >= SAND_UPDATE_INTERVAL) {
        setState((prev) => {
          if (prev.phase !== 'playing') return prev;
          const newGrid = updateSandPhysics(prev.grid, 2);

          // 게임 오버 체크 (일정 주기마다)
          gameOverCheckRef.current++;
          if (gameOverCheckRef.current >= 30) {
            gameOverCheckRef.current = 0;
            if (checkGameOver(newGrid)) {
              return { ...prev, grid: newGrid, phase: 'gameover', currentBlock: null };
            }
          }

          return { ...prev, grid: newGrid };
        });
        lastTime = time;
      }
      sandLoopRef.current = requestAnimationFrame(sandLoop);
    };

    sandLoopRef.current = requestAnimationFrame(sandLoop);

    return () => {
      if (sandLoopRef.current) cancelAnimationFrame(sandLoopRef.current);
    };
  }, [state.phase]);

  // 블록 드롭 루프
  useEffect(() => {
    if (state.phase !== 'playing') return;

    const dropInterval = Math.max(100, INITIAL_DROP_INTERVAL - (state.level - 1) * 50);

    const dropLoop = (time: number) => {
      if (time - lastDropTimeRef.current >= dropInterval) {
        setState((prev) => {
          if (prev.phase !== 'playing' || !prev.currentBlock) return prev;

          const block = prev.currentBlock;
          const newY = block.y + BLOCK_SIZE;

          if (checkCollision(prev.grid, block.shape, block.x, newY, BLOCK_SIZE)) {
            // 충돌 - 블록 고정 (다음 프레임에서)
            setTimeout(lockBlock, 0);
            return prev;
          }

          return {
            ...prev,
            currentBlock: { ...block, y: newY },
          };
        });
        lastDropTimeRef.current = time;
      }
      dropLoopRef.current = requestAnimationFrame(dropLoop);
    };

    dropLoopRef.current = requestAnimationFrame(dropLoop);

    return () => {
      if (dropLoopRef.current) cancelAnimationFrame(dropLoopRef.current);
    };
  }, [state.phase, state.level, lockBlock]);

  return {
    ...state,
    startGame,
    moveBlockTo,
    rotateBlock,
    hardDrop,
    reset,
  };
}

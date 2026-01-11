"use client";

import { useState, useCallback, useRef } from "react";
import { GameState, FallingBlock, ClearingPixel } from "../types";
import { GAME_CONFIG, getRandomBlock } from "../constants";
import {
  createEmptyGrid,
  updateSandPhysics,
  findPixelsToClear,
  clearPixels,
  convertBlockToSand,
  checkCollision,
  canMove,
  checkGameOver,
} from "../utils/sandPhysics";

const { GRID_WIDTH, BLOCK_SIZE, DROP_INTERVAL, SAND_UPDATE_INTERVAL, SCORE_DIVISOR } =
  GAME_CONFIG;

// 애니메이션 설정
const CLEAR_ANIMATION_FRAMES = 8; // 깜빡임 프레임 수
const CLEAR_ANIMATION_INTERVAL = 50; // 각 프레임 간격 (ms)

// 새 블록 생성 함수 (상단에서 시작, 점수에 따라 색상 수 결정)
function createNewBlock(score: number = 0): FallingBlock {
  const { shape, colorIndex } = getRandomBlock(score);
  const blockWidth = shape[0].length * BLOCK_SIZE;
  return {
    shape,
    colorIndex,
    x: Math.floor((GRID_WIDTH - blockWidth) / 2),
    y: 0, // 상단에서 시작
  };
}

const initialState: GameState = {
  phase: "idle",
  grid: createEmptyGrid(),
  currentBlock: null,
  score: 0,
  clearingPixels: [],
  clearingFrame: 0,
};

export function useSandTetris() {
  const [state, setState] = useState<GameState>(initialState);
  const gameLoopRef = useRef<number | null>(null);
  const stateRef = useRef<GameState>(state);
  const skipNextDropRef = useRef(false);
  const lastHardDropTimeRef = useRef(0);

  stateRef.current = state;

  // 게임 루프 시작
  const startGameLoop = useCallback(() => {
    let lastSandTime = performance.now();
    let lastDropTime = performance.now();
    let lastClearAnimTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const currentState = stateRef.current;

      // 게임오버 또는 idle이면 루프 종료
      if (currentState.phase === "gameover" || currentState.phase === "idle") {
        return;
      }

      // 클리어 애니메이션 중
      if (currentState.phase === "clearing") {
        if (now - lastClearAnimTime >= CLEAR_ANIMATION_INTERVAL) {
          const nextFrame = currentState.clearingFrame + 1;

          if (nextFrame >= CLEAR_ANIMATION_FRAMES) {
            // 애니메이션 완료 - 픽셀 삭제하고 게임 재개
            const newGrid = clearPixels(
              currentState.grid,
              currentState.clearingPixels
            );
            const clearedCount = currentState.clearingPixels.length;
            // 점수: 클리어된 픽셀 / SCORE_DIVISOR
            const addedScore = Math.floor(clearedCount / SCORE_DIVISOR);

            setState({
              ...currentState,
              phase: "playing",
              grid: newGrid,
              score: currentState.score + addedScore,
              clearingPixels: [],
              clearingFrame: 0,
            });
          } else {
            // 다음 프레임
            setState({
              ...currentState,
              clearingFrame: nextFrame,
            });
          }
          lastClearAnimTime = now;
        }

        gameLoopRef.current = requestAnimationFrame(loop);
        return;
      }

      // playing 상태
      let needsUpdate = false;
      let newGrid = currentState.grid;
      let newBlock = currentState.currentBlock;
      let newPhase: GameState["phase"] = "playing";
      let newClearingPixels: ClearingPixel[] = [];

      // 모래 물리 업데이트
      if (now - lastSandTime >= SAND_UPDATE_INTERVAL) {
        const result = updateSandPhysics(newGrid);
        newGrid = result.grid;
        lastSandTime = now;
        needsUpdate = true;

        // 모래가 안정화되었을 때만 클리어 체크
        if (!result.changed) {
          const pixelsToClear = findPixelsToClear(newGrid);
          if (pixelsToClear.length > 0) {
            newClearingPixels = pixelsToClear;
            newPhase = "clearing";
          }
        }
      }

      // 블록 드롭
      if (
        newPhase === "playing" &&
        now - lastDropTime >= DROP_INTERVAL &&
        newBlock &&
        !skipNextDropRef.current
      ) {
        const nextY = newBlock.y + BLOCK_SIZE;

        if (
          checkCollision(newGrid, newBlock.shape, newBlock.x, nextY, BLOCK_SIZE)
        ) {
          // 충돌 - 블록을 모래로 변환
          newGrid = convertBlockToSand(
            newGrid,
            newBlock.shape,
            newBlock.x,
            newBlock.y,
            newBlock.colorIndex,
            BLOCK_SIZE
          );

          // 게임오버 체크
          if (checkGameOver(newGrid)) {
            newPhase = "gameover";
            newBlock = null;
          } else {
            // 새 블록 생성 (현재 점수 기준)
            newBlock = createNewBlock(currentState.score);
          }
        } else {
          // 아래로 이동
          newBlock = { ...newBlock, y: nextY };
        }

        lastDropTime = now;
        needsUpdate = true;
      }

      // hardDrop 스킵 플래그 리셋
      if (skipNextDropRef.current) {
        skipNextDropRef.current = false;
        lastDropTime = now;
      }

      if (needsUpdate) {
        setState({
          phase: newPhase,
          grid: newGrid,
          currentBlock: newBlock,
          score: currentState.score,
          clearingPixels: newClearingPixels,
          clearingFrame: 0,
        });
      }

      if (newPhase === "playing" || newPhase === "clearing") {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(loop);
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    const newState: GameState = {
      phase: "playing",
      grid: createEmptyGrid(),
      currentBlock: createNewBlock(),
      score: 0,
      clearingPixels: [],
      clearingFrame: 0,
    };

    setState(newState);
    stateRef.current = newState;

    setTimeout(() => startGameLoop(), 0);
  }, [startGameLoop]);

  // 블록 이동
  const moveBlockTo = useCallback((targetX: number) => {
    setState((prev) => {
      if (prev.phase !== "playing" || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      const blockCenterX = block.x + (block.shape[0].length * BLOCK_SIZE) / 2;
      const step = BLOCK_SIZE;

      let newX = block.x;

      if (targetX < blockCenterX - step / 2) {
        const result = canMove(prev.grid, block.shape, block.x, block.y, BLOCK_SIZE, -step);
        if (result.canMove) {
          newX = block.x + result.actualDx;
        }
      } else if (targetX > blockCenterX + step / 2) {
        const result = canMove(prev.grid, block.shape, block.x, block.y, BLOCK_SIZE, step);
        if (result.canMove) {
          newX = block.x + result.actualDx;
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
      if (prev.phase !== "playing" || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      const rows = block.shape.length;
      const cols = block.shape[0].length;

      const rotated: number[][] = [];
      for (let x = 0; x < cols; x++) {
        const newRow: number[] = [];
        for (let y = rows - 1; y >= 0; y--) {
          newRow.push(block.shape[y][x]);
        }
        rotated.push(newRow);
      }

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
    const now = performance.now();
    if (now - lastHardDropTimeRef.current < 150) return;
    lastHardDropTimeRef.current = now;

    setState((prev) => {
      if (prev.phase !== "playing" || !prev.currentBlock) return prev;

      const block = prev.currentBlock;
      let dropY = block.y;

      while (
        !checkCollision(
          prev.grid,
          block.shape,
          block.x,
          dropY + BLOCK_SIZE,
          BLOCK_SIZE
        )
      ) {
        dropY += BLOCK_SIZE;
      }

      // 블록을 모래로 변환
      const newGrid = convertBlockToSand(
        prev.grid,
        block.shape,
        block.x,
        dropY,
        block.colorIndex,
        BLOCK_SIZE
      );

      // 게임오버 체크
      if (checkGameOver(newGrid)) {
        return {
          ...prev,
          grid: newGrid,
          phase: "gameover",
          currentBlock: null,
        };
      }

      skipNextDropRef.current = true;

      return {
        ...prev,
        grid: newGrid,
        currentBlock: createNewBlock(prev.score),
      };
    });
  }, []);

  // 리셋
  const reset = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setState(initialState);
    stateRef.current = initialState;
  }, []);

  return {
    ...state,
    startGame,
    moveBlockTo,
    rotateBlock,
    hardDrop,
    reset,
  };
}

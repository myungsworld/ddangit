'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useSandTetris } from '../hooks/useSandTetris';
import { GAME_CONFIG, BLOCK_COLORS } from '../constants';

const { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE } = GAME_CONFIG;

// 캔버스 스케일 (모바일에서 보기 좋게)
const SCALE = 3;
const CANVAS_WIDTH = GRID_WIDTH * SCALE;
const CANVAS_HEIGHT = GRID_HEIGHT * SCALE;

export function SandTetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    phase,
    grid,
    currentBlock,
    score,
    level,
    linesCleared,
    startGame,
    moveBlock,
    rotateBlock,
    hardDrop,
    reset,
  } = useSandTetris();

  // 캔버스 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 배경
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 모래 그리기
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = grid[y][x];
        if (cell !== 0) {
          ctx.fillStyle = BLOCK_COLORS[cell - 1] || '#ffffff';
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
    }

    // 현재 블록 그리기
    if (currentBlock) {
      ctx.fillStyle = BLOCK_COLORS[currentBlock.colorIndex - 1] || '#ffffff';

      for (let sy = 0; sy < currentBlock.shape.length; sy++) {
        for (let sx = 0; sx < currentBlock.shape[sy].length; sx++) {
          if (currentBlock.shape[sy][sx] === 0) continue;

          const pixelX = currentBlock.x + sx * BLOCK_SIZE;
          const pixelY = currentBlock.y + sy * BLOCK_SIZE;

          ctx.fillRect(
            pixelX * SCALE,
            pixelY * SCALE,
            BLOCK_SIZE * SCALE,
            BLOCK_SIZE * SCALE
          );
        }
      }
    }
  }, [grid, currentBlock]);

  // 키보드 입력
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveBlock('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveBlock('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveBlock('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotateBlock();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    },
    [phase, moveBlock, rotateBlock, hardDrop]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 터치 컨트롤
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || phase !== 'playing') return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const threshold = 30;

    if (absX < threshold && absY < threshold) {
      // 탭 = 회전
      rotateBlock();
    } else if (absX > absY) {
      // 좌우 스와이프
      if (dx > threshold) moveBlock('right');
      else if (dx < -threshold) moveBlock('left');
    } else {
      // 상하 스와이프
      if (dy > threshold) hardDrop();
    }

    touchStartRef.current = null;
  };

  // 게임 오버 화면
  if (phase === 'gameover') {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <h2 className="text-xl text-gray-400 mb-4">Game Over</h2>
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: GAME_CONFIG.color }}
        >
          {score}
        </div>
        <p className="text-gray-400 mb-2">Level {level}</p>
        <p className="text-gray-500 mb-8">{linesCleared} lines</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            Retry
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Sand Tetris',
                  text: `Score: ${score}, Level ${level}!`,
                  url: window.location.href,
                });
              }
            }}
            className="px-8 py-4 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all active:scale-95"
          >
            Share
          </button>
        </div>
      </div>
    );
  }

  // 시작 화면
  if (phase === 'idle') {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-gray-800"
        onClick={startGame}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Sand Tetris
        </h1>
        <p className="text-gray-400 mb-4">Tap to start</p>
        <div className="text-sm text-gray-500 text-center">
          <p>← → : Move</p>
          <p>↑ : Rotate</p>
          <p>↓ : Soft drop</p>
          <p>Space : Hard drop</p>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div className="flex flex-col items-center gap-4">
      {/* 점수 */}
      <div className="flex justify-between w-full max-w-xs text-sm">
        <div className="text-gray-400">
          Score: <span className="text-white font-bold">{score}</span>
        </div>
        <div className="text-gray-400">
          Level: <span className="text-white font-bold">{level}</span>
        </div>
      </div>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-xl border-2 border-gray-700"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* 모바일 컨트롤 */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        <button
          onClick={() => moveBlock('left')}
          className="h-14 bg-gray-700 text-white text-xl font-bold rounded-xl active:bg-gray-600"
        >
          ←
        </button>
        <button
          onClick={rotateBlock}
          className="h-14 bg-gray-700 text-white text-xl font-bold rounded-xl active:bg-gray-600"
        >
          ↻
        </button>
        <button
          onClick={() => moveBlock('right')}
          className="h-14 bg-gray-700 text-white text-xl font-bold rounded-xl active:bg-gray-600"
        >
          →
        </button>
        <button
          onClick={() => moveBlock('down')}
          className="h-14 bg-gray-700 text-white text-sm font-bold rounded-xl active:bg-gray-600"
        >
          ↓
        </button>
        <button
          onClick={hardDrop}
          className="h-14 bg-amber-600 text-white text-sm font-bold rounded-xl active:bg-amber-500 col-span-2"
        >
          Drop
        </button>
      </div>
    </div>
  );
}

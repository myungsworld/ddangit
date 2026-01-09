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
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    phase,
    grid,
    currentBlock,
    score,
    level,
    linesCleared,
    startGame,
    moveBlockTo,
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

    // 위험 구역 표시 (상단 10%)
    const dangerZone = Math.floor(GRID_HEIGHT * 0.1);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, dangerZone * SCALE);

    // 위험선
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, dangerZone * SCALE);
    ctx.lineTo(CANVAS_WIDTH, dangerZone * SCALE);
    ctx.stroke();
    ctx.setLineDash([]);

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

      // 블록 위치 가이드라인 (세로선)
      const blockCenterX = currentBlock.x + (currentBlock.shape[0].length * BLOCK_SIZE) / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(blockCenterX * SCALE, 0);
      ctx.lineTo(blockCenterX * SCALE, CANVAS_HEIGHT);
      ctx.stroke();
    }
  }, [grid, currentBlock]);

  // 키보드 입력
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentBlock) {
            moveBlockTo(currentBlock.x - BLOCK_SIZE);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentBlock) {
            moveBlockTo(currentBlock.x + GRID_WIDTH);
          }
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
    [phase, currentBlock, moveBlockTo, rotateBlock, hardDrop]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 터치/클릭으로 블록 이동
  const handleCanvasInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (phase !== 'playing' || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // 캔버스 내 좌표 계산
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      // 그리드 좌표로 변환
      const gridX = (canvasX / rect.width) * GRID_WIDTH;
      const gridY = (canvasY / rect.height) * GRID_HEIGHT;

      // 상단 20% 터치 = 회전
      if (gridY < GRID_HEIGHT * 0.2) {
        rotateBlock();
        return;
      }

      // 하단 20% 터치 = 하드 드롭
      if (gridY > GRID_HEIGHT * 0.8) {
        hardDrop();
        return;
      }

      // 중간 영역 = 좌우 이동
      moveBlockTo(gridX);
    },
    [phase, moveBlockTo, rotateBlock, hardDrop]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleCanvasInteraction(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    // 터치 이동 중에는 좌우 이동만
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = touch.clientX - rect.left;
    const gridX = (canvasX / rect.width) * GRID_WIDTH;
    moveBlockTo(gridX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleCanvasInteraction(e.clientX, e.clientY);
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
        <p className="text-gray-400 mb-6">Tap to start</p>
        <div className="text-sm text-gray-500 text-center space-y-1">
          <p>Touch screen to control:</p>
          <p className="text-gray-600">Top = Rotate</p>
          <p className="text-gray-600">Middle = Move left/right</p>
          <p className="text-gray-600">Bottom = Drop</p>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full">
      {/* 점수 */}
      <div className="flex justify-between w-full max-w-xs text-sm px-2">
        <div className="text-gray-400">
          Score: <span className="text-white font-bold">{score}</span>
        </div>
        <div className="text-gray-400">
          Level: <span className="text-white font-bold">{level}</span>
        </div>
      </div>

      {/* 터치 영역 가이드 */}
      <div className="relative w-full max-w-xs">
        {/* 캔버스 */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full rounded-xl border-2 border-gray-700 cursor-pointer"
          style={{ touchAction: 'none', aspectRatio: `${GRID_WIDTH}/${GRID_HEIGHT}` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={handleClick}
        />

        {/* 터치 영역 오버레이 (처음 몇 초간만 표시) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col opacity-30">
          <div className="h-[20%] border-b border-dashed border-white/30 flex items-center justify-center">
            <span className="text-white/50 text-xs">↻ Rotate</span>
          </div>
          <div className="h-[60%] flex items-center justify-center">
            <span className="text-white/50 text-xs">← Move →</span>
          </div>
          <div className="h-[20%] border-t border-dashed border-white/30 flex items-center justify-center">
            <span className="text-white/50 text-xs">↓ Drop</span>
          </div>
        </div>
      </div>

      {/* 조작 힌트 */}
      <p className="text-gray-600 text-xs">Touch screen to play</p>
    </div>
  );
}

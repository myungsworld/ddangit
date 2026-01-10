'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useSandTetris } from '../hooks/useSandTetris';
import { GAME_CONFIG, BLOCK_COLORS } from '../constants';
import { GameResult } from '@/shared/components/game';

const { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE, DANGER_ZONE_RATIO } = GAME_CONFIG;

// 캔버스 스케일
const SCALE = 4;
const CANVAS_WIDTH = GRID_WIDTH * SCALE;
const CANVAS_HEIGHT = GRID_HEIGHT * SCALE;

export function SandTetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const {
    phase,
    grid,
    currentBlock,
    score,
    clearingPixels,
    clearingFrame,
    startGame,
    moveBlockTo,
    rotateBlock,
    hardDrop,
    reset,
  } = useSandTetris();

  // 클리어될 픽셀 Set (빠른 조회용)
  const clearingSet = useMemo(() => {
    const set = new Set<string>();
    for (const [y, x] of clearingPixels) {
      set.add(`${y},${x}`);
    }
    return set;
  }, [clearingPixels]);

  // 캔버스 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 배경 (그라데이션)
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 위험 구역 (상단 20%)
    const dangerHeight = Math.floor(GRID_HEIGHT * DANGER_ZONE_RATIO) * SCALE;
    ctx.fillStyle = 'rgba(255, 71, 87, 0.08)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, dangerHeight);

    // 위험선
    ctx.strokeStyle = 'rgba(255, 71, 87, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(0, dangerHeight);
    ctx.lineTo(CANVAS_WIDTH, dangerHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // 모래 그리기
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = grid[y][x];
        if (cell !== 0) {
          const isClearing = clearingSet.has(`${y},${x}`);

          if (isClearing) {
            // 클리어 애니메이션 - 깜빡임 + 하이라이트
            const isVisible = clearingFrame % 2 === 0;

            if (isVisible) {
              // 흰색 하이라이트로 깜빡임
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
            } else {
              // 원래 색상 (밝게)
              const baseColor = BLOCK_COLORS[cell - 1] || '#ffffff';
              ctx.fillStyle = baseColor;
              ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
            }

            // 테두리 효과
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else {
            // 일반 모래
            ctx.fillStyle = BLOCK_COLORS[cell - 1] || '#ffffff';
            ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          }
        }
      }
    }

    // 클리어 중이면 연결선 표시
    if (phase === 'clearing' && clearingPixels.length > 0) {
      // 좌우 벽에 연결 효과
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);

      // 왼쪽 벽
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, CANVAS_HEIGHT);
      ctx.stroke();

      // 오른쪽 벽
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH, 0);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // 현재 블록 그리기
    if (currentBlock && phase === 'playing') {
      const color = BLOCK_COLORS[currentBlock.colorIndex - 1] || '#ffffff';

      for (let sy = 0; sy < currentBlock.shape.length; sy++) {
        for (let sx = 0; sx < currentBlock.shape[sy].length; sx++) {
          if (currentBlock.shape[sy][sx] === 0) continue;

          const pixelX = currentBlock.x + sx * BLOCK_SIZE;
          const pixelY = currentBlock.y + sy * BLOCK_SIZE;

          // 블록 그리기
          ctx.fillStyle = color;
          ctx.fillRect(
            pixelX * SCALE,
            pixelY * SCALE,
            BLOCK_SIZE * SCALE,
            BLOCK_SIZE * SCALE
          );

          // 블록 테두리
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            pixelX * SCALE + 1,
            pixelY * SCALE + 1,
            BLOCK_SIZE * SCALE - 2,
            BLOCK_SIZE * SCALE - 2
          );
        }
      }

      // 블록 위치 가이드라인
      const blockCenterX = currentBlock.x + (currentBlock.shape[0].length * BLOCK_SIZE) / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(blockCenterX * SCALE, dangerHeight);
      ctx.lineTo(blockCenterX * SCALE, CANVAS_HEIGHT);
      ctx.stroke();
    }
  }, [grid, currentBlock, phase, clearingPixels, clearingFrame, clearingSet]);

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

  // 터치/클릭 처리
  const handleCanvasInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (phase !== 'playing' || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      const gridX = (canvasX / rect.width) * GRID_WIDTH;
      const gridY = (canvasY / rect.height) * GRID_HEIGHT;

      // 상단 20% = 회전
      if (gridY < GRID_HEIGHT * 0.2) {
        rotateBlock();
        return;
      }

      // 하단 20% = 드롭
      if (gridY > GRID_HEIGHT * 0.8) {
        hardDrop();
        return;
      }

      // 중간 = 이동
      moveBlockTo(gridX);
    },
    [phase, moveBlockTo, rotateBlock, hardDrop]
  );

  // 터치 이벤트 발생 시 click 이벤트 방지용
  const touchedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    touchedRef.current = true;
    const touch = e.touches[0];
    handleCanvasInteraction(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const gridX = ((touch.clientX - rect.left) / rect.width) * GRID_WIDTH;
    moveBlockTo(gridX);
  };

  const handleTouchEnd = () => {
    // 터치 후 click 이벤트 무시를 위해 약간의 딜레이
    setTimeout(() => {
      touchedRef.current = false;
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    // 터치로 인한 click이면 무시
    if (touchedRef.current) return;
    handleCanvasInteraction(e.clientX, e.clientY);
  };

  // 점수 포맷팅
  const formatScore = (n: number) => n.toLocaleString();

  // 게임 시작 + 스크롤
  const handleStartGame = useCallback(() => {
    startGame();
    // 게임 시작 후 게임 영역으로 스크롤
    setTimeout(() => {
      gameContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [startGame]);

  // 게임 오버 화면
  if (phase === 'gameover') {
    return (
      <GameResult
        title="Game Over"
        score={formatScore(score)}
        subtitle="pixels cleared"
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Sand Tetris',
              text: `I cleared ${formatScore(score)} pixels!`,
              url: window.location.href,
            });
          }
        }}
      />
    );
  }

  // 시작 화면
  if (phase === 'idle') {
    return (
      <div
        ref={gameContainerRef}
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-2xl"
        style={{ background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)' }}
        onClick={handleStartGame}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Sand Tetris
        </h1>
        <p className="text-gray-400 mb-8">Tap to start</p>

        <div className="text-sm text-gray-500 text-center space-y-2 px-8">
          <p className="text-gray-400 mb-4">Connect same colors from left to right!</p>
          <div className="flex justify-center gap-2 mb-4">
            {BLOCK_COLORS.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="text-gray-600 space-y-1">
            <p>Top area = Rotate</p>
            <p>Middle = Move left/right</p>
            <p>Bottom = Drop</p>
          </div>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div ref={gameContainerRef} className="flex flex-col items-center gap-4 w-full">
      {/* 점수 */}
      <div className="w-full max-w-xs">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Score</p>
          <p className="text-3xl font-bold text-white">{formatScore(score)}</p>
        </div>
      </div>

      {/* 게임 영역 */}
      <div className="relative w-full max-w-xs">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full rounded-xl border border-gray-800 cursor-pointer shadow-2xl"
          style={{
            touchAction: 'none',
            aspectRatio: `${GRID_WIDTH}/${GRID_HEIGHT}`,
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        />

        {/* 클리어 중 오버레이 */}
        {phase === 'clearing' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="bg-black/50 px-4 py-2 rounded-lg">
              <p className="text-white font-bold text-lg animate-pulse">
                +{clearingPixels.length}
              </p>
            </div>
          </div>
        )}

        {/* 터치 가이드 (반투명) */}
        {phase === 'playing' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col opacity-20 rounded-xl overflow-hidden">
            <div className="h-[20%] flex items-center justify-center border-b border-white/10">
              <span className="text-white text-xs">Rotate</span>
            </div>
            <div className="h-[60%] flex items-center justify-center">
              <span className="text-white text-xs">Move</span>
            </div>
            <div className="h-[20%] flex items-center justify-center border-t border-white/10">
              <span className="text-white text-xs">Drop</span>
            </div>
          </div>
        )}
      </div>

      {/* 색상 가이드 */}
      <div className="flex gap-1">
        {BLOCK_COLORS.map((color, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: color, opacity: 0.7 }}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useBlockBlast } from '../hooks/useBlockBlast';
import { GRID_SIZE, CELL_SIZE, GAME_CONFIG } from '../constants';
import { BlockShape } from '../types';
import { GameResult } from '@/shared/components/game/GameResult';
import { useLanguage } from '@/shared/contexts/LanguageContext';

// 블록 미리보기 컴포넌트
function BlockPreview({
  block,
  index,
  onDragStart,
  isDragging,
}: {
  block: BlockShape | null;
  index: number;
  onDragStart: (index: number, e: React.MouseEvent | React.TouchEvent) => void;
  isDragging: boolean;
}) {
  if (!block) return <div className="w-20 h-20" />;

  const cellSize = 16;

  return (
    <div
      className={`cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? 'opacity-50 scale-90' : 'hover:scale-105'
      }`}
      style={{ touchAction: 'none' }}
      onMouseDown={(e) => onDragStart(index, e)}
      onTouchStart={(e) => onDragStart(index, e)}
    >
      <div className="flex flex-col items-center justify-center p-2">
        {block.shape.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={c}
                className="border border-white/20"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? block.color : 'transparent',
                  boxShadow: cell ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 드래그 중인 블록 컴포넌트
function DraggingBlockOverlay({
  block,
  position,
}: {
  block: BlockShape;
  position: { x: number; y: number };
}) {
  const cellSize = CELL_SIZE;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {block.shape.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <div
              key={c}
              className="border border-white/30"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? block.color : 'transparent',
                opacity: cell ? 0.8 : 0,
                boxShadow: cell ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BlockBlastGame() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const {
    phase,
    grid,
    currentBlocks,
    score,
    combo,
    dragging,
    preview,
    startGame,
    resetGame,
    startDrag,
    updatePreview,
    endDrag,
    placeBlock,
    finishGame,
    gameData,
  } = useBlockBlast();

  // ending 애니메이션 후 gameover로 전환
  useEffect(() => {
    if (phase === 'ending') {
      const timer = setTimeout(() => {
        finishGame();
      }, 1500); // 1.5초 애니메이션
      return () => clearTimeout(timer);
    }
  }, [phase, finishGame]);

  // 그리드 위치에서 셀 좌표 계산
  const getCellFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!gridRef.current) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  }, []);

  // 드래그 시작
  const handleDragStart = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragPosition({ x: clientX, y: clientY });
    startDrag(index, 0, 0);
  }, [startDrag]);

  // 드래그 중
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return;

    // 모바일에서 페이지 스크롤 방지
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragPosition({ x: clientX, y: clientY });

    // 블록 모양의 중심점 계산
    const shape = dragging.shape.shape;
    const blockWidth = shape[0].length * CELL_SIZE;
    const blockHeight = shape.length * CELL_SIZE;

    // 그리드 위치 계산 (블록 중심 기준)
    const cell = getCellFromPosition(
      clientX - blockWidth / 2 + CELL_SIZE / 2,
      clientY - blockHeight / 2 + CELL_SIZE / 2
    );

    if (cell) {
      updatePreview(cell.row, cell.col);
    } else {
      updatePreview(-1, -1);
    }
  }, [dragging, getCellFromPosition, updatePreview]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    if (!dragging) return;

    if (preview && preview.valid) {
      placeBlock(preview.row, preview.col);
    } else {
      endDrag();
    }
  }, [dragging, preview, placeBlock, endDrag]);

  // 이벤트 리스너 등록
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragging, handleDragMove, handleDragEnd]);

  // 미리보기 셀 렌더링
  const renderPreviewCells = () => {
    if (!preview || !dragging || preview.row < 0) return null;

    const cells: React.ReactNode[] = [];
    const shape = dragging.shape.shape;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const row = preview.row + r;
          const col = preview.col + c;
          if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            cells.push(
              <div
                key={`preview-${r}-${c}`}
                className="absolute pointer-events-none"
                style={{
                  left: col * CELL_SIZE,
                  top: row * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: preview.valid ? dragging.shape.color : '#EF4444',
                  opacity: 0.5,
                }}
              />
            );
          }
        }
      }
    }

    return cells;
  };

  // 준비 화면
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t(`games.${GAME_CONFIG.id}.name`)}</h2>
          <p className="text-gray-400 whitespace-pre-line">{t(`games.${GAME_CONFIG.id}.description`)}</p>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-4 text-xl font-bold text-white rounded-lg transition-transform hover:scale-105"
          style={{ backgroundColor: GAME_CONFIG.color }}
        >
          {t('common.start')}
        </button>
      </div>
    );
  }

  // 게임 오버 화면
  if (phase === 'gameover') {
    return (
      <GameResult
        title={t('common.gameOver')}
        score={score.toLocaleString()}
        scoreValue={score}
        gameId={GAME_CONFIG.id}
        color={GAME_CONFIG.color}
        onRetry={startGame}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t(`games.${GAME_CONFIG.id}.name`),
              text: `I scored ${score.toLocaleString()} points!`,
              url: window.location.href,
            });
          }
        }}
      />
    );
  }

  const isEnding = phase === 'ending';

  // 게임 플레이 화면 (ending 포함)
  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* 점수 표시 */}
      <div className="flex items-center gap-6 text-white">
        <div className="text-center">
          <div className="text-sm text-gray-400">{t('common.score')}</div>
          <div className="text-2xl font-bold">{score.toLocaleString()}</div>
        </div>
        {combo > 1 && !isEnding && (
          <div className="text-center animate-pulse">
            <div className="text-sm text-yellow-400">COMBO</div>
            <div className="text-2xl font-bold text-yellow-400">x{combo}</div>
          </div>
        )}
      </div>

      {/* 게임오버 메시지 */}
      {isEnding && (
        <div className="text-2xl font-bold text-red-500 animate-pulse">
          {t('common.gameOver')}
        </div>
      )}

      {/* 그리드 */}
      <div
        ref={gridRef}
        className={`relative bg-gray-900 rounded-lg p-1 transition-all duration-300 ${
          isEnding ? 'animate-shake opacity-80' : ''
        }`}
        style={{
          width: GRID_SIZE * CELL_SIZE + 8,
          height: GRID_SIZE * CELL_SIZE + 8,
        }}
      >
        <div className="relative">
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`border transition-all duration-500 ${
                    isEnding && cell.filled ? 'animate-pulse border-red-500' : 'border-gray-700'
                  }`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: cell.filled
                      ? isEnding
                        ? '#4B5563' // 회색으로 변경
                        : cell.color || '#666'
                      : '#1a1a2e',
                    boxShadow: cell.filled
                      ? 'inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.3)'
                      : 'none',
                  }}
                />
              ))}
            </div>
          ))}
          {/* 미리보기 오버레이 */}
          {!isEnding && renderPreviewCells()}
        </div>
      </div>

      {/* 블록 선택 영역 */}
      <div
        className={`flex items-center justify-center gap-4 p-4 bg-gray-800 rounded-lg transition-opacity duration-500 ${
          isEnding ? 'opacity-30' : ''
        }`}
        style={{ touchAction: 'none' }}
      >
        {currentBlocks.map((block, index) => (
          <BlockPreview
            key={index}
            block={block}
            index={index}
            onDragStart={isEnding ? () => {} : handleDragStart}
            isDragging={dragging?.shapeIndex === index}
          />
        ))}
      </div>

      {/* 드래그 중인 블록 */}
      {dragging && !isEnding && (
        <DraggingBlockOverlay block={dragging.shape} position={dragPosition} />
      )}

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}

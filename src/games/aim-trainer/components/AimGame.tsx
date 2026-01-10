'use client';

import { useRef } from 'react';
import { useAimGame } from '../hooks/useAimGame';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game';

export function AimGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    phase,
    target,
    hits,
    misses,
    averageTime,
    accuracy,
    startGame,
    hitTarget,
    miss,
    reset,
    totalTargets,
  } = useAimGame();

  // 클릭 위치로 히트 판정
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !target) {
      miss();
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    // 클릭 위치를 퍼센트로 변환
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // 타겟 중심까지의 거리 (퍼센트 단위)
    const dx = clickX - target.x;
    const dy = clickY - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 타겟 반지름 (퍼센트 단위로 변환)
    // targetSize는 픽셀인데, 컨테이너 너비 기준으로 퍼센트 계산
    const targetRadiusPercent = (GAME_CONFIG.targetSize / 2 / rect.width) * 100;

    if (distance <= targetRadiusPercent) {
      hitTarget();
    } else {
      miss();
    }
  };

  // 결과 화면
  if (phase === 'result') {
    return (
      <GameResult
        title="Average"
        score={`${averageTime}ms`}
        scoreValue={averageTime}
        gameId={GAME_CONFIG.id}
        subtitle={`${accuracy}% accuracy`}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Aim Trainer',
              text: `Avg: ${averageTime}ms, ${accuracy}% accuracy!`,
              url: window.location.href,
            });
          }
        }}
      >
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Hits</span>
            <span className="text-green-500">{hits}</span>
          </div>
          <div className="flex justify-between">
            <span>Misses</span>
            <span className="text-red-500">{misses}</span>
          </div>
        </div>
      </GameResult>
    );
  }

  // 시작 화면
  if (phase === 'idle') {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-gray-800"
        onClick={startGame}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Tap to start
        </h1>
        <p className="text-xl text-gray-400">Hit {totalTargets} targets</p>
      </div>
    );
  }

  // 게임 플레이 화면
  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[60vh] relative rounded-3xl bg-gray-800 cursor-crosshair"
      onClick={handleClick}
    >
      {/* 진행 상황 */}
      <div className="absolute top-4 left-4 text-white font-bold pointer-events-none">
        {hits} / {totalTargets}
      </div>
      <div className="absolute top-4 right-4 text-red-400 text-sm pointer-events-none">
        {misses > 0 && `${misses} miss`}
      </div>

      {/* 타겟 (시각적 표시만, 클릭 판정은 handleClick에서) */}
      {target && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: GAME_CONFIG.targetSize,
            height: GAME_CONFIG.targetSize,
            backgroundColor: GAME_CONFIG.color,
            boxShadow: `0 0 20px ${GAME_CONFIG.color}80`,
          }}
        />
      )}
    </div>
  );
}

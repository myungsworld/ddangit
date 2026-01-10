'use client';

import { useAimGame } from '../hooks/useAimGame';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game';

export function AimGame() {
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

  // 결과 화면
  if (phase === 'result') {
    return (
      <GameResult
        title="Average"
        score={`${averageTime}ms`}
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
      className="w-full h-full min-h-[60vh] relative rounded-3xl bg-gray-800 cursor-crosshair"
      onClick={miss}
    >
      {/* 진행 상황 */}
      <div className="absolute top-4 left-4 text-white font-bold">
        {hits} / {totalTargets}
      </div>
      <div className="absolute top-4 right-4 text-red-400 text-sm">
        {misses > 0 && `${misses} miss`}
      </div>

      {/* 타겟 */}
      {target && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            hitTarget();
          }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 active:scale-90"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: GAME_CONFIG.targetSize,
            height: GAME_CONFIG.targetSize,
            backgroundColor: GAME_CONFIG.color,
          }}
        />
      )}
    </div>
  );
}

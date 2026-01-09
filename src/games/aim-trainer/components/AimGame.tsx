'use client';

import { useAimGame } from '../hooks/useAimGame';
import { GAME_CONFIG } from '../constants';

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
      <div className="w-full max-w-md mx-auto text-center p-8">
        <h2 className="text-xl text-gray-400 mb-4">Average</h2>
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: GAME_CONFIG.color }}
        >
          {averageTime}ms
        </div>
        <p className="text-xl text-gray-400 mb-6">{accuracy}% accuracy</p>

        {/* 상세 결과 */}
        <div className="mb-8 space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Hits</span>
            <span className="text-green-500">{hits}</span>
          </div>
          <div className="flex justify-between">
            <span>Misses</span>
            <span className="text-red-500">{misses}</span>
          </div>
        </div>

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
                  title: 'Aim Trainer',
                  text: `Avg: ${averageTime}ms, ${accuracy}% accuracy!`,
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

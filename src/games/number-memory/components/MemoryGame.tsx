'use client';

import { useMemoryGame } from '../hooks/useMemoryGame';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game';

export function MemoryGame() {
  const {
    phase,
    level,
    currentNumber,
    userInput,
    highestLevel,
    startGame,
    nextLevel,
    handleInput,
    handleDelete,
    showResult,
    reset,
  } = useMemoryGame();

  // 숫자 키패드
  const Keypad = () => (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => handleInput(String(num))}
          className="h-14 bg-gray-700 text-white text-xl font-bold rounded-xl hover:bg-gray-600 active:scale-95 transition-all"
        >
          {num}
        </button>
      ))}
      <button
        onClick={handleDelete}
        className="h-14 bg-gray-800 text-gray-400 text-sm font-bold rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
      >
        ←
      </button>
      <button
        onClick={() => handleInput('0')}
        className="h-14 bg-gray-700 text-white text-xl font-bold rounded-xl hover:bg-gray-600 active:scale-95 transition-all"
      >
        0
      </button>
      <div className="h-14" />
    </div>
  );

  // 결과 화면
  if (phase === 'result') {
    return (
      <GameResult
        title="Level"
        score={String(highestLevel)}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Memory Test',
              text: `I reached level ${highestLevel}!`,
              url: window.location.href,
            });
          }
        }}
      />
    );
  }

  // 정답/오답 화면
  if (phase === 'correct' || phase === 'wrong') {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <div
          className={`text-6xl font-bold mb-4 ${
            phase === 'correct' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {phase === 'correct' ? '✓' : '✗'}
        </div>
        <p className="text-xl text-gray-400 mb-2">
          {phase === 'correct' ? 'Correct!' : 'Wrong!'}
        </p>
        {phase === 'wrong' && (
          <p className="text-gray-500 mb-4">
            Answer: {currentNumber}
          </p>
        )}
        <p className="text-gray-500 mb-8">Level {level}</p>

        <button
          onClick={phase === 'correct' ? nextLevel : showResult}
          className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
        >
          {phase === 'correct' ? 'Next' : 'Result'}
        </button>
      </div>
    );
  }

  // 숫자 보여주기
  if (phase === 'showing') {
    return (
      <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center rounded-3xl bg-gray-800">
        <p className="text-gray-400 mb-4">Level {level}</p>
        <div
          className="text-5xl md:text-6xl font-bold tracking-widest"
          style={{ color: GAME_CONFIG.color }}
        >
          {currentNumber}
        </div>
      </div>
    );
  }

  // 입력 화면
  if (phase === 'input') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <p className="text-center text-gray-400 mb-4">Level {level}</p>

        {/* 입력 표시 */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white tracking-widest min-h-[48px]">
            {userInput || <span className="text-gray-600">?</span>}
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: currentNumber.length }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-1 rounded ${
                  i < userInput.length ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <Keypad />
      </div>
    );
  }

  // 시작 화면
  return (
    <div
      className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-gray-800"
      onClick={startGame}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Tap to start
      </h1>
      <p className="text-xl text-gray-400">Remember the numbers</p>
    </div>
  );
}

'use client';

import { useRef, useEffect } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game';

export function TypingGame() {
  const {
    phase,
    text,
    userInput,
    wpm,
    accuracy,
    timeInSeconds,
    startGame,
    handleInput,
    reset,
  } = useTypingGame();

  const inputRef = useRef<HTMLInputElement>(null);

  // 게임 시작 시 인풋에 포커스
  useEffect(() => {
    if (phase === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  // 결과 화면
  if (phase === 'result') {
    return (
      <GameResult
        title="WPM"
        score={String(wpm)}
        subtitle={`${accuracy}% accuracy`}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Typing Test',
              text: `${wpm} WPM, ${accuracy}% accuracy!`,
              url: window.location.href,
            });
          }
        }}
      >
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Time</span>
            <span>{timeInSeconds}s</span>
          </div>
          <div className="flex justify-between">
            <span>Characters</span>
            <span>{text.length}</span>
          </div>
        </div>
      </GameResult>
    );
  }

  // 타이핑 화면
  if (phase === 'playing') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        {/* 타이핑할 텍스트 */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl">
          <p className="text-lg leading-relaxed font-mono">
            {text.split('').map((char, i) => {
              let color = 'text-gray-500'; // 아직 안 친 글자
              if (i < userInput.length) {
                color = userInput[i] === char ? 'text-white' : 'text-red-500';
              }
              if (i === userInput.length) {
                color = 'text-white bg-gray-600'; // 현재 위치
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </p>
        </div>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full p-4 bg-gray-900 text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          placeholder="Start typing..."
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
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
      <p className="text-xl text-gray-400">Type as fast as you can</p>
    </div>
  );
}

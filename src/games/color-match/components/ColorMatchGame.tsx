'use client';

import React, { useEffect } from 'react';
import { useColorMatch } from '../hooks/useColorMatch';
import { GAME_CONFIG, COLORS } from '../constants';
import { GameResult } from '@/shared/components/game/GameResult';
import { useLanguage } from '@/shared/contexts/LanguageContext';

export function ColorMatchGame() {
  const { t, language } = useLanguage();

  const {
    phase,
    score,
    streak,
    timeLeft,
    currentQuestion,
    options,
    lastAnswer,
    startGame,
    selectAnswer,
    finishGame,
    gameData,
  } = useColorMatch();

  // ending 애니메이션 후 gameover로 전환
  useEffect(() => {
    if (phase === 'ending') {
      const timer = setTimeout(() => {
        finishGame();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, finishGame]);

  // 준비 화면
  if (phase === 'ready') {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-2xl"
        style={{ backgroundColor: '#1a1a2e' }}
        onClick={startGame}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t(`games.${GAME_CONFIG.id}.name`)}
        </h1>
        <p className="text-gray-400 mb-6 whitespace-pre-line text-center px-4">
          {t(`games.${GAME_CONFIG.id}.description`)}
        </p>

        {/* 게임 설명 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 max-w-xs text-center">
          <p className="text-white mb-2">
            {language === 'ko' ? '글자가 아닌' : 'Select the'}
          </p>
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: '#3B82F6' }}
          >
            {language === 'ko' ? '빨강' : 'RED'}
          </p>
          <p className="text-white">
            {language === 'ko' ? '글자색을 선택하세요!' : 'COLOR of the text!'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {language === 'ko' ? '(정답: 파랑)' : '(Answer: BLUE)'}
          </p>
        </div>

        <p className="text-xl text-white/80">{t('common.tapToStart')}</p>
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
              text: `I scored ${score} points with ${gameData.bestStreak} streak!`,
              url: window.location.href,
            });
          }
        }}
      />
    );
  }

  const isEnding = phase === 'ending';

  // 게임 플레이 화면
  return (
    <div className={`flex flex-col items-center gap-4 select-none transition-opacity duration-500 ${isEnding ? 'opacity-50' : ''}`}>
      {/* 상단 정보 */}
      <div className="flex items-center justify-between w-full max-w-sm px-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">{t('common.score')}</div>
          <div className="text-2xl font-bold text-white">{score}</div>
        </div>

        {/* 타이머 */}
        <div className="text-center">
          <div
            className={`text-4xl font-bold ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}
          >
            {timeLeft}
          </div>
        </div>

        {/* 연속 정답 */}
        <div className="text-center">
          <div className="text-sm text-gray-400">Streak</div>
          <div className={`text-2xl font-bold ${streak > 0 ? 'text-yellow-400' : 'text-white'}`}>
            {streak > 0 ? `x${streak}` : '-'}
          </div>
        </div>
      </div>

      {/* 피드백 표시 */}
      <div className="h-8">
        {lastAnswer && (
          <div
            className={`text-xl font-bold animate-bounce ${
              lastAnswer === 'correct' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {lastAnswer === 'correct' ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* 문제 표시 */}
      {currentQuestion && (
        <div className="bg-gray-900 rounded-2xl p-8 min-w-[280px]">
          <p
            className="text-5xl md:text-6xl font-bold text-center transition-all duration-200"
            style={{ color: currentQuestion.textColor.hex }}
          >
            {language === 'ko'
              ? currentQuestion.displayColor.name.ko
              : currentQuestion.displayColor.name.en}
          </p>
        </div>
      )}

      {/* 힌트 */}
      <p className="text-sm text-gray-500">
        {language === 'ko' ? '글자색을 선택하세요' : 'Select the text color'}
      </p>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4">
        {options.map((color) => (
          <button
            key={color.id}
            onClick={() => !isEnding && selectAnswer(color.id)}
            disabled={isEnding}
            className="py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-150 active:scale-95 hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: color.hex }}
          >
            {language === 'ko' ? color.name.ko : color.name.en}
          </button>
        ))}
      </div>

      {/* 게임 오버 메시지 */}
      {isEnding && (
        <div className="text-2xl font-bold text-red-500 animate-pulse mt-4">
          {t('common.gameOver')}
        </div>
      )}
    </div>
  );
}

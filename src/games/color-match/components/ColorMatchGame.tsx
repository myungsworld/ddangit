'use client';

import React, { useEffect, useState } from 'react';
import { useColorMatch } from '../hooks/useColorMatch';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game/GameResult';
import { useLanguage } from '@/shared/contexts/LanguageContext';

// 점수에 따른 등급 결정
function getRankKey(score: number): string {
  if (score >= 50) return 'godlike';
  if (score >= 40) return 'insane';
  if (score >= 30) return 'fast';
  if (score >= 20) return 'good';
  if (score >= 10) return 'average';
  if (score >= 5) return 'slow';
  return 'verySlow';
}

export function ColorMatchGame() {
  const { t, language } = useLanguage();
  const [shake, setShake] = useState(false);

  const {
    phase,
    score,
    streak,
    timeLeft,
    currentQuestion,
    options,
    lastAnswer,
    showTimeBonus,
    showTimePenalty,
    combo,
    startGame,
    selectAnswer,
    finishGame,
    gameData,
  } = useColorMatch();

  // 오답 시 화면 흔들림
  useEffect(() => {
    if (lastAnswer === 'wrong') {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [lastAnswer]);

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

        {/* 규칙 설명 */}
        <div className="text-sm text-gray-500 mb-4 text-center px-4">
          <p>{language === 'ko' ? '⚠️ 틀리면 -5점, -2초!' : '⚠️ Wrong: -5pts, -2sec!'}</p>
          <p>{language === 'ko' ? '🔥 5연속 정답 → +1초 보너스!' : '🔥 5 streak → +1sec bonus!'}</p>
        </div>

        <p className="text-xl text-white/80">{t('common.tapToStart')}</p>
      </div>
    );
  }

  // 게임 오버 화면
  if (phase === 'gameover') {
    const rankKey = getRankKey(score);
    const rankLabel = t(`games.${GAME_CONFIG.id}.ranks.${rankKey}`);
    return (
      <GameResult
        title={t('common.gameOver')}
        score={score.toLocaleString()}
        scoreValue={score}
        gameId={GAME_CONFIG.id}
        subtitle={rankLabel}
        color={GAME_CONFIG.color}
        onRetry={startGame}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t(`games.${GAME_CONFIG.id}.name`),
              text: `${score} points - ${rankLabel}`,
              url: window.location.href,
            });
          }
        }}
      >
        {/* 게임 통계 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>{language === 'ko' ? '최고 연속' : 'Best Streak'}</span>
            <span className="text-yellow-400">x{gameData.bestStreak}</span>
          </div>
        </div>
      </GameResult>
    );
  }

  const isEnding = phase === 'ending';

  // 게임 플레이 화면
  return (
    <div
      className={`flex flex-col items-center gap-4 select-none transition-all duration-300 ${isEnding ? 'opacity-50' : ''} ${shake ? 'animate-shake' : ''}`}
      style={{
        animation: shake ? 'shake 0.3s ease-in-out' : undefined,
      }}
    >
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
      `}</style>

      {/* 상단 정보 */}
      <div className="flex items-center justify-between w-full max-w-sm px-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">{t('common.score')}</div>
          <div className={`text-2xl font-bold transition-all duration-200 ${lastAnswer === 'wrong' ? 'text-red-400' : 'text-white'}`}>
            {score}
            {lastAnswer === 'wrong' && <span className="text-sm ml-1">-5</span>}
          </div>
        </div>

        {/* 타이머 */}
        <div className="text-center relative">
          <div
            className={`text-4xl font-bold transition-all duration-200 ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse' :
              showTimePenalty ? 'text-red-400' :
              showTimeBonus ? 'text-green-400' : 'text-white'
            }`}
          >
            {timeLeft}
          </div>
          {/* 시간 보너스/패널티 표시 */}
          {showTimeBonus && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-green-400 text-sm font-bold animate-bounce">
              +1s
            </div>
          )}
          {showTimePenalty && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-red-400 text-sm font-bold animate-bounce">
              -2s
            </div>
          )}
        </div>

        {/* 연속 정답 / 콤보 */}
        <div className="text-center">
          <div className="text-sm text-gray-400">
            {streak >= 3 ? '🔥' : ''} Streak
          </div>
          <div className={`text-2xl font-bold transition-all duration-200 ${
            streak >= 5 ? 'text-orange-400 scale-110' :
            streak >= 3 ? 'text-yellow-400' :
            streak > 0 ? 'text-white' : 'text-gray-500'
          }`}>
            {streak > 0 ? `x${streak}` : '-'}
          </div>
          {/* 콤보 진행 표시 (5연속까지) */}
          {streak > 0 && combo > 0 && (
            <div className="flex gap-0.5 justify-center mt-1">
              {[...Array(GAME_CONFIG.streakForBonus)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < combo ? 'bg-yellow-400' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          )}
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
            {lastAnswer === 'correct' ? (
              streak >= 3 ? `🔥 +${10 + (streak - 1) * 5}` : '✓'
            ) : (
              '✗ -5'
            )}
          </div>
        )}
      </div>

      {/* 문제 표시 */}
      {currentQuestion && (
        <div
          className={`bg-gray-900 rounded-2xl p-8 min-w-[280px] transition-all duration-200 ${
            lastAnswer === 'wrong' ? 'border-2 border-red-500' : ''
          }`}
        >
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
            className="py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-150 active:scale-95 hover:brightness-110 hover:scale-105 disabled:opacity-50"
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

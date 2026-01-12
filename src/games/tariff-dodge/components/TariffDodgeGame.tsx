'use client';

import { useRef, useCallback } from 'react';
import { useTariffDodge } from '../hooks/useTariffDodge';
import { GAME_CONFIG, getRankKey } from '../constants';
import { GameResult } from '@/shared/components/game';
import { useLanguage } from '@/shared/contexts/LanguageContext';

export function TariffDodgeGame() {
  const { t } = useLanguage();
  const {
    phase,
    score,
    playerX,
    playerCharacter,
    tariffs,
    level,
    hitTariff,
    startGame,
    setTargetPosition,
    clearTargetPosition,
    reset,
  } = useTariffDodge();

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const getPositionPercent = useCallback((clientX: number) => {
    if (!gameAreaRef.current) return 50;
    const rect = gameAreaRef.current.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (phase !== 'playing') return;
    const xPercent = getPositionPercent(e.touches[0].clientX);
    setTargetPosition(xPercent);
  }, [phase, getPositionPercent, setTargetPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (phase !== 'playing') return;
    const xPercent = getPositionPercent(e.touches[0].clientX);
    setTargetPosition(xPercent);
  }, [phase, getPositionPercent, setTargetPosition]);

  const handleTouchEnd = useCallback(() => {
    clearTargetPosition();
  }, [clearTargetPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (phase !== 'playing') return;
    const xPercent = getPositionPercent(e.clientX);
    setTargetPosition(xPercent);
  }, [phase, getPositionPercent, setTargetPosition]);

  const handleMouseLeave = useCallback(() => {
    clearTargetPosition();
  }, [clearTargetPosition]);

  if (phase === 'result') {
    const rankKey = getRankKey(score);
    const rankLabel = t(`games.tariff-dodge.ranks.${rankKey}`);
    return (
      <GameResult
        title={t('games.tariff-dodge.survived')}
        score={`${score}s`}
        scoreValue={score}
        gameId={GAME_CONFIG.id}
        subtitle={`${playerCharacter.emoji} ${hitTariff}% ${t('games.tariff-dodge.hitBy')} - ${rankLabel}`}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t('games.tariff-dodge.name'),
              text: `${playerCharacter.emoji} ${score}s ${t('games.tariff-dodge.survived')}! ${hitTariff}% ${t('games.tariff-dodge.hitBy')}`,
              url: window.location.href,
            });
          }
        }}
      />
    );
  }

  if (phase === 'waiting') {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-red-600 select-none"
        onClick={startGame}
      >
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('games.tariff-dodge.name')}
          </h1>
          <p className="text-lg text-white/80 mb-6 whitespace-pre-line">
            {t('games.tariff-dodge.description')}
          </p>
          <div className="flex justify-center gap-4 mb-6 text-4xl">
            <span>🚗</span>
            <span>✈️</span>
            <span>📱</span>
            <span>💻</span>
          </div>
          <p className="text-xl text-white/90">{t('common.tapToStart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameAreaRef}
      className="w-full h-full min-h-[60vh] flex flex-col rounded-3xl bg-gradient-to-b from-blue-900 to-blue-950 overflow-hidden select-none relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/30 z-10">
        <div className="text-white">
          <span className="text-2xl font-bold">{score}s</span>
        </div>
        <div className="text-white text-sm">
          Lv.{level + 1}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        {/* 떨어지는 관세들 */}
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className="absolute flex items-center justify-center bg-red-500 rounded-lg shadow-lg font-bold text-white text-sm"
            style={{
              left: `${tariff.x}%`,
              top: `${tariff.y}%`,
              width: `${GAME_CONFIG.tariffSize}px`,
              height: `${GAME_CONFIG.tariffSize}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {tariff.percent}%
          </div>
        ))}

        {/* 플레이어 */}
        <div
          className="absolute flex items-center justify-center text-4xl"
          style={{
            left: `${playerX}%`,
            top: `${GAME_CONFIG.playerY}%`,
            width: `${GAME_CONFIG.playerSize}px`,
            height: `${GAME_CONFIG.playerSize}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {playerCharacter.emoji}
        </div>
      </div>

      {/* Controls hint */}
      <div className="p-3 bg-black/30 text-center text-white/60 text-sm">
        {t('games.tariff-dodge.controls')}
      </div>
    </div>
  );
}

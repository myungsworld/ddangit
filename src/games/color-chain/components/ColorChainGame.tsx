'use client';

import { useColorChain } from '../hooks/useColorChain';
import { GAME_CONFIG, getRankKey, COLORS } from '../constants';
import { GameResult } from '@/shared/components/game';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Circle } from '../types';

export function ColorChainGame() {
  const { t } = useLanguage();
  const {
    phase,
    score,
    chain,
    lastColor,
    circles,
    timeLeft,
    penalty,
    startGame,
    handleCircleClick,
    reset,
  } = useColorChain();

  if (phase === 'result') {
    const rankKey = getRankKey(score);
    const rankLabel = t(`games.color-chain.ranks.${rankKey}`);
    return (
      <GameResult
        title={t('common.score')}
        score={`${score}`}
        scoreValue={score}
        gameId={GAME_CONFIG.id}
        subtitle={rankLabel}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t('games.color-chain.name'),
              text: `${score} - ${rankLabel}`,
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
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-amber-600"
        onClick={startGame}
      >
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('games.color-chain.name')}
          </h1>
          <p className="text-lg text-white/80 mb-6 whitespace-pre-line">
            {t('games.color-chain.description')}
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {COLORS.map((color) => (
              <div
                key={color}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-xl text-white/90">{t('common.tapToStart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[60vh] flex flex-col rounded-3xl bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <div className="text-white">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-gray-400 ml-2">{t('common.score')}</span>
        </div>
        <div className="text-center">
          {chain > 1 && (
            <div className="text-amber-400 font-bold animate-pulse">
              x{Math.pow(2, chain - 1)} {t('games.color-chain.chain')}
            </div>
          )}
          {lastColor && (
            <div
              className="w-6 h-6 rounded-full mx-auto mt-1 border-2 border-white"
              style={{ backgroundColor: lastColor }}
            />
          )}
        </div>
        <div className="text-white text-2xl font-bold">
          {timeLeft}s
        </div>
      </div>

      {/* Penalty overlay */}
      {penalty > 0 && (
        <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center z-10 rounded-3xl">
          <span className="text-4xl font-bold text-white animate-pulse">
            {t('games.color-chain.wrongColor')}
          </span>
        </div>
      )}

      {/* Game area */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        {circles.map((circle) => (
          <CircleButton
            key={circle.id}
            circle={circle}
            onClick={() => handleCircleClick(circle)}
            disabled={penalty > 0}
          />
        ))}
      </div>
    </div>
  );
}

function CircleButton({
  circle,
  onClick,
  disabled,
}: {
  circle: Circle;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      className="absolute rounded-full transition-transform active:scale-90 shadow-lg"
      style={{
        backgroundColor: circle.color,
        width: `${GAME_CONFIG.circleSize}px`,
        height: `${GAME_CONFIG.circleSize}px`,
        left: `${circle.x}%`,
        top: `${circle.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

'use client';

import { useColorChain } from '../hooks/useColorChain';
import { GAME_CONFIG, getRankKey, getColorsForLevel } from '../constants';
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
    level,
    levelUpMessage,
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
    const initialColors = getColorsForLevel(0);
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-amber-600 select-none"
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
            {initialColors.map((color) => (
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
    <div className="w-full h-full min-h-[60vh] flex flex-col rounded-3xl bg-gray-900 overflow-hidden select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <div className="text-white">
          <span className="text-2xl font-bold">{score}</span>
        </div>
        <div className="text-center h-12 flex flex-col justify-center items-center">
          <div className={`text-amber-400 font-bold text-sm ${chain > 1 ? 'visible' : 'invisible'}`}>
            x{Math.pow(2, Math.max(0, chain - 1))}
          </div>
          <div
            className="w-6 h-6 rounded-full border-2 border-white"
            style={{ backgroundColor: lastColor || 'transparent', visibility: lastColor ? 'visible' : 'hidden' }}
          />
        </div>
        <div className="text-white text-2xl font-bold">{timeLeft}s</div>
      </div>

      {/* Level up message */}
      {levelUpMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-amber-500 text-white px-6 py-3 rounded-full text-2xl font-bold shadow-lg">
            {levelUpMessage === 'newColor'
              ? t('games.color-chain.newColor')
              : t('games.color-chain.levelUp')}
          </div>
        </div>
      )}

      {/* Penalty overlay */}
      {penalty > 0 && (
        <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center z-10 rounded-3xl">
          <span className="text-4xl font-bold text-white">
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

      {/* Level indicator */}
      <div className="p-2 bg-gray-800 flex justify-center items-center gap-2">
        <span className="text-gray-400 text-sm">Lv.{level + 1}</span>
        <div className="flex gap-1">
          {getColorsForLevel(level).map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-gray-400 text-sm">({circles.length})</span>
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
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onClick();
  };

  return (
    <div
      className="absolute rounded-full shadow-lg cursor-pointer"
      style={{
        backgroundColor: circle.color,
        width: `${GAME_CONFIG.circleSize}px`,
        height: `${GAME_CONFIG.circleSize}px`,
        left: `${circle.x}%`,
        top: `${circle.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }}
      onClick={handleClick}
      onTouchEnd={handleClick}
    />
  );
}

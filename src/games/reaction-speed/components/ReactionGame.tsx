'use client';

import { useReactionGame } from '../hooks/useReactionGame';
import { GAME_CONFIG } from '../constants';
import { GameResult } from '@/shared/components/game';
import { useLanguage } from '@/shared/contexts/LanguageContext';

// 반응 시간에 따른 등급 결정
function getRankKey(time: number): string {
  if (time < 150) return 'godlike';
  if (time < 200) return 'insane';
  if (time < 250) return 'fast';
  if (time < 300) return 'good';
  if (time < 400) return 'average';
  if (time < 500) return 'slow';
  return 'verySlow';
}

export function ReactionGame() {
  const { t } = useLanguage();
  const {
    phase,
    reactionTime,
    averageTime,
    handleClick,
    reset,
    currentAttempt,
    totalAttempts,
    attempts,
  } = useReactionGame();

  const getBackgroundColor = () => {
    switch (phase) {
      case 'waiting':
        return 'bg-blue-600';
      case 'ready':
        return 'bg-red-600';
      case 'go':
        return 'bg-green-500';
      case 'early':
        return 'bg-red-700';
      case 'result':
        return 'bg-gray-800';
      default:
        return 'bg-gray-800';
    }
  };

  const getMessage = () => {
    switch (phase) {
      case 'waiting':
        return {
          main: t('common.tapToStart'),
          sub: `${currentAttempt} / ${totalAttempts}`,
        };
      case 'ready':
        return {
          main: t('games.reaction-speed.wait'),
          sub: `${currentAttempt} / ${totalAttempts}`,
        };
      case 'go':
        return {
          main: t('games.reaction-speed.clickNow'),
          sub: '',
        };
      case 'early':
        return {
          main: t('games.reaction-speed.tooEarly'),
          sub: t('common.tapToStart'),
        };
      case 'result':
        const rankKey = getRankKey(averageTime);
        return {
          main: `${averageTime}ms`,
          sub: t(`games.reaction-speed.ranks.${rankKey}`),
        };
      default:
        return { main: '', sub: '' };
    }
  };

  const message = getMessage();

  if (phase === 'result') {
    const rankKey = getRankKey(averageTime);
    const rankLabel = t(`games.reaction-speed.ranks.${rankKey}`);
    return (
      <GameResult
        title={t('common.score')}
        score={`${averageTime}ms`}
        scoreValue={averageTime}
        gameId={GAME_CONFIG.id}
        subtitle={rankLabel}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t('games.reaction-speed.name'),
              text: `${averageTime}ms - ${rankLabel}`,
              url: window.location.href,
            });
          }
        }}
      >
        <div className="space-y-2">
          {attempts.map((time, i) => (
            <div
              key={i}
              className="flex justify-between text-gray-400 text-sm"
            >
              <span>#{i + 1}</span>
              <span>{time}ms</span>
            </div>
          ))}
        </div>
      </GameResult>
    );
  }

  return (
    <div
      className={`w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 rounded-3xl ${getBackgroundColor()}`}
      onClick={handleClick}
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {message.main}
        </h1>
        <p className="text-xl text-white/80">{message.sub}</p>

        {reactionTime && phase === 'waiting' && (
          <p className="mt-4 text-white/60">Last: {reactionTime}ms</p>
        )}
      </div>
    </div>
  );
}

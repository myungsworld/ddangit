'use client';

import { useReactionGame } from '../hooks/useReactionGame';
import { GAME_CONFIG, getRating } from '../constants';
import { GameResult } from '@/shared/components/game';

export function ReactionGame() {
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
          main: 'Tap to start',
          sub: `${currentAttempt} / ${totalAttempts}`,
        };
      case 'ready':
        return {
          main: 'Wait...',
          sub: `${currentAttempt} / ${totalAttempts}`,
        };
      case 'go':
        return {
          main: 'NOW!',
          sub: 'Tap!',
        };
      case 'early':
        return {
          main: 'Too early!',
          sub: 'Tap to retry',
        };
      case 'result':
        const rating = getRating(averageTime);
        return {
          main: `${averageTime}ms`,
          sub: `${rating.emoji} ${rating.label}`,
        };
      default:
        return { main: '', sub: '' };
    }
  };

  const message = getMessage();

  if (phase === 'result') {
    const rating = getRating(averageTime);
    return (
      <GameResult
        title="Average"
        score={`${averageTime}ms`}
        scoreValue={averageTime}
        gameId={GAME_CONFIG.id}
        subtitle={`${rating.emoji} ${rating.label}`}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Reaction Test',
              text: `My avg: ${averageTime}ms! Try it!`,
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

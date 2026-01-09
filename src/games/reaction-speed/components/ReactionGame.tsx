'use client';

import { useReactionGame } from '../hooks/useReactionGame';
import { GAME_CONFIG, getRating } from '../constants';

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
          sub: 'Tap when green',
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
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <h2 className="text-xl text-gray-400 mb-4">Average</h2>
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: GAME_CONFIG.color }}
        >
          {averageTime}ms
        </div>
        <p className="text-2xl mb-6">{message.sub}</p>

        <div className="mb-8 space-y-2">
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
                  title: 'Reaction Test',
                  text: `My avg: ${averageTime}ms! Try it!`,
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

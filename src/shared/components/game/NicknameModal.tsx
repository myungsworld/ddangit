'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

interface NicknameModalProps {
  rank: number;
  score: string;
  color: string;
  onSubmit: (nickname: string) => void;
  onSkip: () => void;
  isSubmitting?: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function NicknameModal({
  rank,
  score,
  color,
  onSubmit,
  onSkip,
  isSubmitting = false,
}: NicknameModalProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">{MEDALS[rank - 1]}</div>

        <h2 className="text-2xl font-bold mb-2" style={{ color }}>
          #{rank} Today!
        </h2>

        <p className="text-gray-400 mb-6">
          Score: <span className="text-white font-bold">{score}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 10))}
            placeholder="Enter nickname"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white text-center text-lg mb-4 focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': color } as React.CSSProperties}
            maxLength={10}
            autoFocus
            disabled={isSubmitting}
          />

          <p className="text-gray-500 text-sm mb-6">
            {nickname.length}/10 characters
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onSkip}
              disabled={isSubmitting}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!nickname.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

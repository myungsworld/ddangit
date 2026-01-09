'use client';

import { Button } from '../ui/Button';

interface GameResultProps {
  title: string;
  score: string;
  subtitle?: string;
  onRetry: () => void;
  onShare?: () => void;
  color: string;
}

export function GameResult({
  title,
  score,
  subtitle,
  onRetry,
  onShare,
  color,
}: GameResultProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl text-gray-400 mb-2">{title}</h2>
      <div className="text-6xl font-bold mb-2" style={{ color }}>
        {score}
      </div>
      {subtitle && <p className="text-gray-500 mb-8">{subtitle}</p>}

      <div className="flex gap-4 justify-center">
        <Button onClick={onRetry} variant="primary" size="lg">
          Retry
        </Button>
        {onShare && (
          <Button onClick={onShare} variant="secondary" size="lg">
            Share
          </Button>
        )}
      </div>
    </div>
  );
}

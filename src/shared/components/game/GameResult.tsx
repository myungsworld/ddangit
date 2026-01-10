'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface GameResultProps {
  title: string;
  score: string;
  subtitle?: string;
  children?: ReactNode;  // 추가 정보 (상세 결과 등)
  onRetry: () => void;
  onShare?: () => void;
  color: string;
}

export function GameResult({
  title,
  score,
  subtitle,
  children,
  onRetry,
  onShare,
  color,
}: GameResultProps) {
  return (
    <div className="w-full max-w-md mx-auto text-center p-8">
      <div className="mb-8">
        <p className="text-gray-500 uppercase tracking-widest text-sm mb-2">{title}</p>
        <div className="text-6xl font-bold mb-4" style={{ color }}>
          {score}
        </div>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>

      {children && <div className="mb-8">{children}</div>}

      <div className="flex flex-col gap-4">
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
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          ← Try other games
        </Link>
      </div>
    </div>
  );
}

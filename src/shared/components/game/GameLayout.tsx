'use client';

import { ReactNode, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AdSlot } from '../ad';
import { useLanguage } from '@/shared/contexts/LanguageContext';

interface GameLayoutProps {
  children: ReactNode;
  gameId: string;
  color: string;
}

export function GameLayout({ children, gameId, color }: GameLayoutProps) {
  const { t } = useLanguage();
  const title = t(`games.${gameId}.name`);
  const gameAreaRef = useRef<HTMLElement>(null);

  // 게임 페이지 진입 시 게임 영역으로 스크롤 (모바일 UX 개선)
  useEffect(() => {
    const timer = setTimeout(() => {
      gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Ad */}
      <AdSlot size="banner" position="top" />

      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ←
        </Link>
        <h1 className="font-bold" style={{ color }}>
          {title}
        </h1>
        <Link
          href={`/games/${gameId}/guide`}
          className="text-gray-400 hover:text-white transition-colors text-lg"
          title="How to play"
        >
          ?
        </Link>
      </header>

      {/* Game Area - flex-1 ensures it takes remaining space */}
      <main ref={gameAreaRef} className="flex-1 flex items-center justify-center p-4 min-h-0">
        {children}
      </main>

      {/* Bottom Ad */}
      <AdSlot size="banner" position="bottom" />
    </div>
  );
}

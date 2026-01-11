'use client';

import { ReactNode } from 'react';
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
        <div className="w-6" />
      </header>

      {/* Game Area - flex-1 ensures it takes remaining space */}
      <main className="flex-1 flex items-center justify-center p-4 min-h-0">
        {children}
      </main>

      {/* Bottom Ad */}
      <AdSlot size="banner" position="bottom" />
    </div>
  );
}

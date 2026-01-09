'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  color: string;
}

export function GameLayout({ children, title, color }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <div className="p-4">
        <div className="h-14 bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 text-xs">
          Ad
        </div>
      </div>
    </div>
  );
}

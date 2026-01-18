import { ReactNode } from 'react';
import Link from 'next/link';

interface StaticPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          {children}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
}

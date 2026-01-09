import { GAMES } from '@/shared/constants';
import { GameCard } from '@/shared/components/game';
import { AdSlot } from '@/shared/components/ad';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Ad */}
      <AdSlot size="banner" position="top" />

      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-1">ddangit</h1>
        <p className="text-gray-500 text-sm">quick games</p>
      </header>

      {/* Game List */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-4">
        <div className="space-y-3">
          {GAMES.map((game, index) => (
            <div key={game.id}>
              <GameCard game={game} />
              {/* Inline ad after every 2 games */}
              {(index + 1) % 2 === 0 && index < GAMES.length - 1 && (
                <div className="mt-3">
                  <AdSlot size="banner" position="inline" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Ad */}
      <AdSlot size="banner" position="bottom" />
    </div>
  );
}

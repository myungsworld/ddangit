import { GAMES } from '@/shared/constants';
import { GameCard } from '@/shared/components/game';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-1">ddangit</h1>
        <p className="text-gray-500 text-sm">quick games</p>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-24">
        <div className="space-y-3">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950">
        <div className="max-w-lg mx-auto h-14 bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 text-xs">
          Ad
        </div>
      </div>
    </div>
  );
}

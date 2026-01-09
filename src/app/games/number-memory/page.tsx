import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { MemoryGame } from '@/games/number-memory';
import { GAME_CONFIG } from '@/games/number-memory/constants';

export const metadata: Metadata = {
  title: 'Memory Test | ddangit',
  description: 'Test your memory',
};

export default function NumberMemoryPage() {
  return (
    <GameLayout title={GAME_CONFIG.name} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <MemoryGame />
      </div>
    </GameLayout>
  );
}

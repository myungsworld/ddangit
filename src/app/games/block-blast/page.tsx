import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { BlockBlastGame } from '@/games/block-blast';
import { GAME_CONFIG } from '@/games/block-blast/constants';

export const metadata: Metadata = {
  title: 'Block Blast | ddangit',
  description: 'Clear rows and columns by placing blocks',
};

export default function BlockBlastPage() {
  return (
    <GameLayout gameId={GAME_CONFIG.id} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <BlockBlastGame />
      </div>
    </GameLayout>
  );
}

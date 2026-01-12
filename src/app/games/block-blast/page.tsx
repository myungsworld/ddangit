import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { BlockBlastGame } from '@/games/block-blast';
import { GAME_CONFIG } from '@/games/block-blast/constants';

export const metadata: Metadata = {
  title: 'Block Blast | ddangit',
  description: 'Place blocks to complete rows and columns!',
  openGraph: {
    title: 'Block Blast | ddangit',
    description: 'Place blocks to complete rows and columns!',
    url: '/games/block-blast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Block Blast | ddangit',
    description: 'Place blocks to complete rows and columns!',
  },
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

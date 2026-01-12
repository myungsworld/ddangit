import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { SandTetrisGame } from '@/games/sand-tetris';
import { GAME_CONFIG } from '@/games/sand-tetris/constants';

export const metadata: Metadata = {
  title: 'Sand Tetris | ddangit',
  description: 'Tetris with sand physics! Connect same colors to clear.',
  openGraph: {
    title: 'Sand Tetris | ddangit',
    description: 'Tetris with sand physics! Connect same colors to clear.',
    url: '/games/sand-tetris',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sand Tetris | ddangit',
    description: 'Tetris with sand physics! Connect same colors to clear.',
  },
};

export default function SandTetrisPage() {
  return (
    <GameLayout gameId={GAME_CONFIG.id} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <SandTetrisGame />
      </div>
    </GameLayout>
  );
}

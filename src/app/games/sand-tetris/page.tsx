import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { SandTetrisGame } from '@/games/sand-tetris';
import { GAME_CONFIG } from '@/games/sand-tetris/constants';

export const metadata: Metadata = {
  title: 'Sand Tetris | ddangit',
  description: 'Tetris with sand physics',
};

export default function SandTetrisPage() {
  return (
    <GameLayout title={GAME_CONFIG.name} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <SandTetrisGame />
      </div>
    </GameLayout>
  );
}

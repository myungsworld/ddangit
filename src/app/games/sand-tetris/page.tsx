import { GameLayout } from '@/shared/components/game';
import { SandTetrisGame } from '@/games/sand-tetris';
import { generateGameMetadata, getGameById } from '@/shared/constants';

const GAME_ID = 'sand-tetris';
const game = getGameById(GAME_ID)!;

export const metadata = generateGameMetadata(GAME_ID);

export default function SandTetrisPage() {
  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <SandTetrisGame />
      </div>
    </GameLayout>
  );
}

import { GameLayout } from '@/shared/components/game';
import { BlockBlastGame } from '@/games/block-blast';
import { generateGameMetadata, getGameById } from '@/shared/constants';

const GAME_ID = 'block-blast';
const game = getGameById(GAME_ID)!;

export const metadata = generateGameMetadata(GAME_ID);

export default function BlockBlastPage() {
  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <BlockBlastGame />
      </div>
    </GameLayout>
  );
}

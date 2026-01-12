import { GameLayout } from '@/shared/components/game';
import { ColorChainGame } from '@/games/color-chain';
import { generateGameMetadata, getGameById } from '@/shared/constants';

const GAME_ID = 'color-chain';
const game = getGameById(GAME_ID)!;

export const metadata = generateGameMetadata(GAME_ID);

export default function ColorChainPage() {
  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <ColorChainGame />
      </div>
    </GameLayout>
  );
}

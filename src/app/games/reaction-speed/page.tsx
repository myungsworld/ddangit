import { GameLayout } from '@/shared/components/game';
import { ReactionGame } from '@/games/reaction-speed';
import { generateGameMetadata, getGameById } from '@/shared/constants';

const GAME_ID = 'reaction-speed';
const game = getGameById(GAME_ID)!;

export const metadata = generateGameMetadata(GAME_ID);

export default function ReactionSpeedPage() {
  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <ReactionGame />
      </div>
    </GameLayout>
  );
}

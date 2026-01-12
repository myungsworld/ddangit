import { GameLayout } from '@/shared/components/game';
import { TariffDodgeGame } from '@/games/tariff-dodge';
import { generateGameMetadata, getGameById } from '@/shared/constants';

const GAME_ID = 'tariff-dodge';
const game = getGameById(GAME_ID)!;

export const metadata = generateGameMetadata(GAME_ID);

export default function TariffDodgePage() {
  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <TariffDodgeGame />
      </div>
    </GameLayout>
  );
}

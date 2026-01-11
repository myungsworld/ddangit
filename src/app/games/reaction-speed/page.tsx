import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { ReactionGame } from '@/games/reaction-speed';
import { GAME_CONFIG } from '@/games/reaction-speed/constants';

export const metadata: Metadata = {
  title: 'Reaction Test | ddangit',
  description: 'Test your reaction speed',
};

export default function ReactionSpeedPage() {
  return (
    <GameLayout gameId={GAME_CONFIG.id} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <ReactionGame />
      </div>
    </GameLayout>
  );
}

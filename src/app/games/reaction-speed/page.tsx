import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { ReactionGame } from '@/games/reaction-speed';
import { GAME_CONFIG } from '@/games/reaction-speed/constants';

export const metadata: Metadata = {
  title: 'Reaction Speed Test | ddangit',
  description: 'How fast can you react? Test your reflexes now!',
  openGraph: {
    title: 'Reaction Speed Test | ddangit',
    description: 'How fast can you react? Test your reflexes now!',
    url: '/games/reaction-speed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reaction Speed Test | ddangit',
    description: 'How fast can you react? Test your reflexes now!',
  },
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

import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { AimGame } from '@/games/aim-trainer';
import { GAME_CONFIG } from '@/games/aim-trainer/constants';

export const metadata: Metadata = {
  title: 'Aim Trainer | ddangit',
  description: 'Test your aim! Hit targets as fast as you can.',
  openGraph: {
    title: 'Aim Trainer | ddangit',
    description: 'Test your aim! Hit targets as fast as you can.',
    url: '/games/aim-trainer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aim Trainer | ddangit',
    description: 'Test your aim! Hit targets as fast as you can.',
  },
};

export default function AimTrainerPage() {
  return (
    <GameLayout gameId={GAME_CONFIG.id} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <AimGame />
      </div>
    </GameLayout>
  );
}

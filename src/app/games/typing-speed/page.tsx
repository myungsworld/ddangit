import { Metadata } from 'next';
import { GameLayout } from '@/shared/components/game';
import { TypingGame } from '@/games/typing-speed';
import { GAME_CONFIG } from '@/games/typing-speed/constants';

export const metadata: Metadata = {
  title: 'Typing Test | ddangit',
  description: 'Test your typing speed',
};

export default function TypingSpeedPage() {
  return (
    <GameLayout title={GAME_CONFIG.name} color={GAME_CONFIG.color}>
      <div className="w-full max-w-lg mx-auto">
        <TypingGame />
      </div>
    </GameLayout>
  );
}

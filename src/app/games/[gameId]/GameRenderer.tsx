'use client';

import { GAME_COMPONENTS } from '@/games/registry';

interface GameRendererProps {
  gameId: string;
}

export function GameRenderer({ gameId }: GameRendererProps) {
  const GameComponent = GAME_COMPONENTS[gameId];

  if (!GameComponent) {
    return <div>Game not found</div>;
  }

  return <GameComponent />;
}

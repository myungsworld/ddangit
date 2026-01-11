'use client';

import Link from 'next/link';
import { GameMeta } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface GameCardProps {
  game: GameMeta;
}

export function GameCard({ game }: GameCardProps) {
  const { t } = useLanguage();

  const name = t(`games.${game.id}.name`) || game.name;
  const description = t(`games.${game.id}.description`) || game.description;

  return (
    <Link href={game.path}>
      <div
        className="p-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        style={{ backgroundColor: game.color + '20' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">{game.icon}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-sm text-gray-400 whitespace-pre-line">{description}</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {game.estimatedTime}
          </span>
        </div>
      </div>
    </Link>
  );
}

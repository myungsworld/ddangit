'use client';

import { RankEntry } from '@/lib/ranking/types';

interface RankingBoardProps {
  ranking: RankEntry[];
  highlightRank?: number | null;
  color: string;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function RankingBoard({ ranking, highlightRank, color }: RankingBoardProps) {
  if (ranking.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No rankings yet today. Be the first!
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-3 text-center">
        Today&apos;s Top 3
      </h3>
      <div className="space-y-2">
        {ranking.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between px-4 py-2 rounded-lg ${
              highlightRank === entry.rank ? 'ring-2' : 'bg-gray-800/50'
            }`}
            style={
              highlightRank === entry.rank
                ? { backgroundColor: `${color}20`, '--tw-ring-color': color } as React.CSSProperties
                : undefined
            }
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{MEDALS[entry.rank - 1]}</span>
              <span className="text-white font-medium">{entry.nickname}</span>
            </div>
            <span className="text-gray-400 font-mono">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

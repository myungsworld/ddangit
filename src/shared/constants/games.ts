import { GameMeta } from '../types';

export const GAMES: GameMeta[] = [
  {
    id: 'sand-tetris',
    name: 'Sand Tetris',
    description: 'Tetris with sand physics',
    icon: '🧱',
    path: '/games/sand-tetris',
    color: '#D97706',
    estimatedTime: '3m',
  },
  {
    id: 'block-blast',
    name: 'Block Blast',
    description: 'Clear rows and columns',
    icon: '🧩',
    path: '/games/block-blast',
    color: '#8B5CF6',
    estimatedTime: '3m',
  },
  {
    id: 'reaction-speed',
    name: 'Reaction',
    description: 'Test your reflexes',
    icon: '⚡',
    path: '/games/reaction-speed',
    color: '#10B981',
    estimatedTime: '30s',
  },
  {
    id: 'aim-trainer',
    name: 'Aim',
    description: 'Hit the targets',
    icon: '🎯',
    path: '/games/aim-trainer',
    color: '#EF4444',
    estimatedTime: '30s',
  },
];

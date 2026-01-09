import { GameMeta } from '../types';

export const GAMES: GameMeta[] = [
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
  {
    id: 'number-memory',
    name: 'Memory',
    description: 'Remember the numbers',
    icon: '🔢',
    path: '/games/number-memory',
    color: '#8B5CF6',
    estimatedTime: '1m',
  },
  {
    id: 'typing-speed',
    name: 'Typing',
    description: 'Type as fast as you can',
    icon: '⌨️',
    path: '/games/typing-speed',
    color: '#F59E0B',
    estimatedTime: '1m',
  },
];

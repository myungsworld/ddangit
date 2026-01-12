import { GameMeta } from '../types';

/**
 * 게임 레지스트리 - Single Source of Truth
 *
 * 새 게임 추가 시 여기에만 등록하면 자동으로:
 * - 메인 페이지 게임 목록
 * - sitemap.xml
 * - 홍보 메시지 (Twitter/Bluesky)
 * - SEO 메타데이터
 *
 * 추가로 필요한 작업:
 * - src/app/games/[game-id]/page.tsx 생성
 * - src/shared/i18n/ko.json, en.json 번역 추가
 */
export const GAMES: GameMeta[] = [
  {
    id: 'sand-tetris',
    name: 'Sand Tetris',
    description: 'Tetris with sand physics',
    icon: '🧱',
    path: '/games/sand-tetris',
    color: '#D97706',
    estimatedTime: '3m',
    seo: {
      title: 'Sand Tetris | ddangit',
      description: 'Tetris with sand physics! Connect same colors to clear.',
    },
  },
  {
    id: 'block-blast',
    name: 'Block Blast',
    description: 'Clear rows and columns',
    icon: '🧩',
    path: '/games/block-blast',
    color: '#8B5CF6',
    estimatedTime: '3m',
    seo: {
      title: 'Block Blast | ddangit',
      description: 'Place blocks to complete rows and columns!',
    },
  },
  {
    id: 'reaction-speed',
    name: 'Reaction',
    description: 'Test your reflexes',
    icon: '⚡',
    path: '/games/reaction-speed',
    color: '#10B981',
    estimatedTime: '30s',
    seo: {
      title: 'Reaction Speed Test | ddangit',
      description: 'Test your reaction speed! How fast can you react?',
    },
  },
  {
    id: 'aim-trainer',
    name: 'Aim',
    description: 'Hit the targets',
    icon: '🎯',
    path: '/games/aim-trainer',
    color: '#EF4444',
    estimatedTime: '30s',
    seo: {
      title: 'Aim Trainer | ddangit',
      description: 'Test your aim! Hit targets as fast as you can.',
    },
  },
];

// 유틸리티 함수
export const getGameById = (id: string): GameMeta | undefined =>
  GAMES.find((game) => game.id === id);

export const getGameIds = (): string[] => GAMES.map((game) => game.id);

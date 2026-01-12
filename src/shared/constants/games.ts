import { GameMeta } from '../types';

/**
 * 게임 레지스트리 - Single Source of Truth
 *
 * 새 게임 추가 시 여기 + registry.tsx에 등록하면 자동으로:
 * - 메인 페이지 게임 목록
 * - sitemap.xml
 * - 홍보 메시지 (Twitter/Bluesky)
 * - SEO 메타데이터
 * - 게임 페이지 (동적 라우트)
 *
 * 추가로 필요한 작업:
 * - src/games/[game-id]/ 폴더 생성
 * - src/games/registry.tsx에 컴포넌트 등록
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
    id: 'color-chain',
    name: 'Color Chain',
    description: 'Combo chain game',
    icon: '🔗',
    path: '/games/color-chain',
    color: '#F59E0B',
    estimatedTime: '30s',
    seo: {
      title: 'Color Chain | ddangit',
      description: 'Tap same colors for 2x combos! Level up to unlock new colors.',
    },
  },
  {
    id: 'tariff-dodge',
    name: 'Tariff Dodge',
    description: 'Dodge the tariffs',
    icon: '📦',
    path: '/games/tariff-dodge',
    color: '#DC2626',
    estimatedTime: '30s',
    seo: {
      title: 'Tariff Dodge | ddangit',
      description: 'Dodge falling tariffs! How long can you survive?',
    },
  },
];

// O(1) 조회를 위한 Map
const GAMES_MAP = new Map<string, GameMeta>(GAMES.map((g) => [g.id, g]));

// 유틸리티 함수
export const getGameById = (id: string): GameMeta | undefined =>
  GAMES_MAP.get(id);

export const getGameIds = (): string[] => GAMES.map((game) => game.id);

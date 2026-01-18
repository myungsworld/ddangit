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
 * - 게임 가이드 페이지
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
    guide: {
      howToPlay: [
        'Blocks fall from the top of the screen',
        'Use arrow keys or swipe to move blocks left/right',
        'Tap or press up to rotate blocks',
        'Connect same-colored pixels horizontally to clear them',
        'The game ends when blocks stack to the top',
      ],
      scoring: [
        'Points for each pixel cleared',
        'Bonus multiplier for chain reactions',
        'Higher levels add new colors for more challenge',
        'Combo clears give extra points',
      ],
      tips: [
        'Plan ahead - think about where colors will connect',
        'Keep the board as flat as possible',
        "Don't let one side get too high",
        'Use gravity to your advantage for chain reactions',
        'Clear colors before new ones are introduced',
      ],
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
    guide: {
      howToPlay: [
        'Drag and drop blocks onto the 8x8 grid',
        'Complete full rows or columns to clear them',
        'You get 3 random blocks at a time',
        "Game ends when you can't place any blocks",
      ],
      scoring: [
        'Points for each block placed',
        'Bonus points for clearing lines',
        'Combo bonus for clearing multiple lines at once',
        'Higher combos = exponentially more points',
      ],
      tips: [
        'Always keep space for the longest blocks',
        'Try to clear multiple lines at once for combos',
        "Don't fill corners too quickly",
        'Plan 2-3 moves ahead',
        "Sometimes it's better to wait for a better block",
      ],
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
    guide: {
      howToPlay: [
        'Wait for the screen to turn green',
        'Tap as quickly as possible when it changes',
        "If you tap too early (while red), you'll have to restart",
        'Your reaction time is measured in milliseconds (ms)',
      ],
      scoring: [
        'Under 150ms: Incredible reflexes!',
        '150-200ms: Very fast',
        '200-250ms: Above average',
        '250-300ms: Average human reaction',
        'Over 300ms: Room for improvement',
      ],
      tips: [
        'Keep your finger hovering close to the screen',
        'Focus on the center of the screen',
        'Take a deep breath before starting',
        'Avoid distractions - find a quiet moment',
        'Practice regularly to improve your baseline',
      ],
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
    guide: {
      howToPlay: [
        'Colored circles appear on screen',
        'Tap circles matching the target color shown at top',
        'Tap same colors consecutively for 2x combo multiplier',
        'Wrong color breaks your combo',
        'New colors unlock as you level up',
      ],
      scoring: [
        'Base points per correct tap',
        '2x multiplier for consecutive same-color taps',
        'Level up bonuses',
        'Speed bonus for fast taps',
      ],
      tips: [
        'Focus on building long chains of the same color',
        "Don't rush - accuracy is more important than speed",
        'When new colors appear, take time to adjust',
        'Develop peripheral vision to spot colors quickly',
      ],
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
    guide: {
      howToPlay: [
        'Move your character left and right to dodge falling tariffs',
        'Use mouse movement or touch/drag on mobile',
        'Survive as long as possible',
        'Tariffs speed up over time',
      ],
      scoring: [
        'Score increases every second you survive',
        'Longer survival = higher score',
        'No points for dodging - just stay alive!',
      ],
      tips: [
        'Stay near the center for more escape options',
        'Make small movements rather than large ones',
        'Watch the spawn points at the top',
        'Keep your eyes moving between obstacles',
        "Don't panic when things speed up",
      ],
    },
  },
  {
    id: 'color-match',
    name: 'Color Match',
    description: 'Stroop test challenge',
    icon: '🎨',
    path: '/games/color-match',
    color: '#EC4899',
    estimatedTime: '30s',
    seo: {
      title: 'Color Match | ddangit',
      description: 'Stroop test! Match the color of the text, not the word!',
    },
    guide: {
      howToPlay: [
        'A color word appears on screen (e.g., "RED")',
        'The word is displayed in a different color',
        'Tap the button matching the INK COLOR, not the word',
        'Example: If "RED" is written in blue ink, tap BLUE',
        'You have 30 seconds to score as many as possible',
      ],
      scoring: [
        '+10 points for correct answer',
        '-5 points and -2 seconds for wrong answer',
        '+1 second bonus every 5 correct answers in a row',
        'Build streaks for time bonuses',
      ],
      tips: [
        'Ignore what the word says - focus on the color',
        'This is called the Stroop Effect - a cognitive test',
        'Practice makes the brain faster at filtering',
        'Take a breath if you make mistakes',
        'Speed comes naturally with accuracy first',
      ],
    },
  },
  {
    id: 'infinite-stairs',
    name: 'Infinite Stairs',
    description: 'Climb as high as you can',
    icon: '🪜',
    path: '/games/infinite-stairs',
    color: '#6366F1',
    estimatedTime: '30s',
    seo: {
      title: 'Infinite Stairs | ddangit',
      description: 'Climb infinite stairs! Left or right, how high can you go?',
    },
    guide: {
      howToPlay: [
        'Stairs appear going left and right alternately',
        'Tap the correct side (left/right) to climb',
        'Wrong direction or too slow = game over',
        'Fast inputs give time bonus',
        'Build combos to enter Fever Mode',
      ],
      scoring: [
        'Points per floor climbed',
        'Bonus for fast inputs',
        'Golden stairs give extra points',
        'Fever mode multiplies your score',
      ],
      tips: [
        "Find a rhythm - don't just react, anticipate",
        'Keep your thumbs ready on both sides',
        'Focus on the next 2-3 stairs ahead',
        'Speed up gradually as you get comfortable',
        'Fever mode is key to high scores',
      ],
    },
  },
];

// O(1) 조회를 위한 Map
const GAMES_MAP = new Map<string, GameMeta>(GAMES.map((g) => [g.id, g]));

// 유틸리티 함수
export const getGameById = (id: string): GameMeta | undefined =>
  GAMES_MAP.get(id);

export const getGameIds = (): string[] => GAMES.map((game) => game.id);

export const GAME_CONFIG = {
  id: 'color-chain',
  name: 'Color Chain',
  color: '#F59E0B',
  gameDuration: 30,
  circleSize: 60,
  penaltyTime: 1,
  moveSpeed: 0.5,
  moveInterval: 16,
};

export const ALL_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#22C55E', // green
  '#FBBF24', // yellow
  '#A855F7', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

// 레벨별 설정
export const LEVEL_CONFIG = [
  { scoreThreshold: 0, colors: 4, circles: 6, timeBonus: 0 },
  { scoreThreshold: 50, colors: 4, circles: 7, timeBonus: 3 },
  { scoreThreshold: 150, colors: 5, circles: 8, timeBonus: 3 },
  { scoreThreshold: 300, colors: 5, circles: 9, timeBonus: 2 },
  { scoreThreshold: 500, colors: 6, circles: 10, timeBonus: 2 },
  { scoreThreshold: 800, colors: 6, circles: 11, timeBonus: 2 },
  { scoreThreshold: 1200, colors: 7, circles: 12, timeBonus: 1 },
  { scoreThreshold: 1800, colors: 8, circles: 13, timeBonus: 1 },
];

export function getLevelForScore(score: number): number {
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (score >= LEVEL_CONFIG[i].scoreThreshold) {
      return i;
    }
  }
  return 0;
}

export function getColorsForLevel(level: number): string[] {
  const colorCount = LEVEL_CONFIG[level]?.colors || 4;
  return ALL_COLORS.slice(0, colorCount);
}

export function getCircleCountForLevel(level: number): number {
  return LEVEL_CONFIG[level]?.circles || 6;
}

export function getTimeBonusForLevel(level: number): number {
  return LEVEL_CONFIG[level]?.timeBonus || 0;
}

export const SCORE_RATINGS = [
  { max: 50, key: 'verySlow' },
  { max: 100, key: 'slow' },
  { max: 200, key: 'average' },
  { max: 400, key: 'good' },
  { max: 700, key: 'fast' },
  { max: 1000, key: 'insane' },
  { max: Infinity, key: 'godlike' },
];

export function getRankKey(score: number): string {
  return SCORE_RATINGS.find((r) => score <= r.max)?.key || 'godlike';
}

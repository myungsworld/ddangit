export const GAME_CONFIG = {
  id: 'color-chain',
  name: 'Color Chain',
  color: '#F59E0B',
  gameDuration: 30,
  circleCount: 6,
  circleSize: 60,
  penaltyTime: 1,
  spawnDelay: 300,
  moveSpeed: 0.5,
  moveInterval: 16,
};

export const COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#22C55E', // green
  '#FBBF24', // yellow
];

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

export const GAME_CONFIG = {
  id: 'tariff-dodge',
  name: 'Tariff Dodge',
  color: '#DC2626',
  playerSize: 50,
  tariffSize: 40,
  playerY: 85,
  spawnInterval: 800,
  moveSpeed: 3, // 더 세밀한 조작을 위해 낮춤
};

export const TARIFF_PERCENTS = [25, 50, 100, 104, 145, 200];

// 플레이어 캐릭터 (수출품들)
export const PLAYER_CHARACTERS = [
  { emoji: '🚗', name: 'car' },
  { emoji: '✈️', name: 'airplane' },
  { emoji: '📱', name: 'smartphone' },
  { emoji: '💻', name: 'laptop' },
  { emoji: '🔋', name: 'battery' },
  { emoji: '📦', name: 'package' },
  { emoji: '🚢', name: 'ship' },
  { emoji: '🧊', name: 'semiconductor' },
];

export const LEVEL_CONFIG = [
  { scoreThreshold: 0, spawnInterval: 1000, tariffSpeed: 2 },
  { scoreThreshold: 10, spawnInterval: 900, tariffSpeed: 2.5 },
  { scoreThreshold: 25, spawnInterval: 800, tariffSpeed: 3 },
  { scoreThreshold: 50, spawnInterval: 700, tariffSpeed: 3.5 },
  { scoreThreshold: 80, spawnInterval: 600, tariffSpeed: 4 },
  { scoreThreshold: 120, spawnInterval: 500, tariffSpeed: 4.5 },
  { scoreThreshold: 170, spawnInterval: 400, tariffSpeed: 5 },
];

export function getLevelForScore(score: number): number {
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (score >= LEVEL_CONFIG[i].scoreThreshold) {
      return i;
    }
  }
  return 0;
}

export const SCORE_RATINGS = [
  { max: 10, key: 'verySlow' },
  { max: 25, key: 'slow' },
  { max: 50, key: 'average' },
  { max: 80, key: 'good' },
  { max: 120, key: 'fast' },
  { max: 170, key: 'insane' },
  { max: Infinity, key: 'godlike' },
];

export function getRankKey(score: number): string {
  return SCORE_RATINGS.find((r) => score <= r.max)?.key || 'godlike';
}

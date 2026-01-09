export const GAME_CONFIG = {
  id: 'reaction-speed',
  name: 'Reaction',
  color: '#10B981',
  minDelay: 1000,
  maxDelay: 5000,
  totalAttempts: 5,
};

export const REACTION_RATINGS = [
  { max: 150, label: 'Lightning', emoji: '⚡' },
  { max: 200, label: 'Fast', emoji: '🚀' },
  { max: 250, label: 'Quick', emoji: '🏃' },
  { max: 300, label: 'Average', emoji: '👍' },
  { max: 400, label: 'Slow', emoji: '🐢' },
  { max: Infinity, label: 'Sleepy', emoji: '😴' },
];

export function getRating(ms: number) {
  return REACTION_RATINGS.find((r) => ms <= r.max) || REACTION_RATINGS[REACTION_RATINGS.length - 1];
}

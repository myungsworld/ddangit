export type Direction = 'left' | 'right';
export type GamePhase = 'ready' | 'playing' | 'falling' | 'gameover';

export interface Stair {
  id: number;
  direction: Direction;
}

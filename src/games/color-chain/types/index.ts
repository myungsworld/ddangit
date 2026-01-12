export type ColorChainPhase = 'waiting' | 'playing' | 'result';

export interface Circle {
  id: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface ColorChainData {
  phase: ColorChainPhase;
  score: number;
  chain: number;
  lastColor: string | null;
  circles: Circle[];
  timeLeft: number;
  penalty: number;
  level: number;
  levelUpMessage: string | null;
}

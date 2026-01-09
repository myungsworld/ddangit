export type ReactionGamePhase = 'waiting' | 'ready' | 'go' | 'result' | 'early';

export interface ReactionGameData {
  phase: ReactionGamePhase;
  startTime: number | null;
  reactionTime: number | null;
  attempts: number[];
}

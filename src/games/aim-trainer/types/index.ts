// 에임 트레이너 게임 타입 정의

export type AimGamePhase = 'idle' | 'playing' | 'result';

export interface Target {
  id: number;
  x: number;  // 퍼센트 (0-100)
  y: number;  // 퍼센트 (0-100)
}

export interface AimGameData {
  phase: AimGamePhase;
  target: Target | null;
  hits: number;
  misses: number;
  startTime: number | null;
  hitTimes: number[];  // 각 타겟 맞추는데 걸린 시간
}

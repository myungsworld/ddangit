export type TariffDodgePhase = 'waiting' | 'playing' | 'result';

export interface Tariff {
  id: number;
  x: number;
  y: number;
  percent: number;
  speed: number;
}

export interface PlayerCharacter {
  emoji: string;
  name: string;
}

export interface TariffDodgeData {
  phase: TariffDodgePhase;
  score: number;
  playerX: number;
  playerCharacter: PlayerCharacter;
  tariffs: Tariff[];
  level: number;
  hitTariff: number | null;
}

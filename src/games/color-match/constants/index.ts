import { ColorDef } from '../types';

// 게임 설정
export const GAME_CONFIG = {
  id: 'color-match',
  color: '#EC4899', // pink
  totalTime: 30, // 30초 게임
  baseScore: 10,
  streakBonus: 5, // 연속 정답 보너스
  wrongPenalty: 5, // 오답 감점
  timePenalty: 2, // 오답 시 시간 감소 (초)
  timeBonus: 1, // 5연속 정답 시 시간 보너스 (초)
  streakForBonus: 5, // 시간 보너스 받을 연속 정답 수
};

// 색상 정의
export const COLORS: ColorDef[] = [
  { id: 'red', name: { ko: '빨강', en: 'RED' }, hex: '#EF4444' },
  { id: 'blue', name: { ko: '파랑', en: 'BLUE' }, hex: '#3B82F6' },
  { id: 'green', name: { ko: '초록', en: 'GREEN' }, hex: '#22C55E' },
  { id: 'yellow', name: { ko: '노랑', en: 'YELLOW' }, hex: '#EAB308' },
  { id: 'purple', name: { ko: '보라', en: 'PURPLE' }, hex: '#A855F7' },
  { id: 'orange', name: { ko: '주황', en: 'ORANGE' }, hex: '#F97316' },
];

// 로컬스토리지 키
export const STORAGE_KEY = 'color-match-high-score';

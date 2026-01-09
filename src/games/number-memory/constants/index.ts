// 숫자 기억 게임 설정

export const GAME_CONFIG = {
  id: 'number-memory',
  name: 'Memory',
  color: '#8B5CF6',
  startLevel: 3,          // 시작 자릿수
  showTimeBase: 1000,     // 기본 표시 시간 (ms)
  showTimePerDigit: 500,  // 자릿수당 추가 시간 (ms)
};

// 숫자 표시 시간 계산
export function getShowTime(level: number): number {
  return GAME_CONFIG.showTimeBase + (level * GAME_CONFIG.showTimePerDigit);
}

// 랜덤 숫자 생성
export function generateNumber(digits: number): string {
  let result = '';
  // 첫 자리는 0이 아닌 숫자
  result += Math.floor(Math.random() * 9) + 1;
  // 나머지 자리
  for (let i = 1; i < digits; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// 홍보 메시지 템플릿

import { RankingEntry } from '../storage/types';

export type MessageType = 'general' | 'new_game' | 'update' | 'ranking';

interface MessageContext {
  type: MessageType;
  ranking?: RankingEntry[];
  gameName?: string;
}

// 메시지 템플릿 풀
const TEMPLATES: Record<MessageType, string[]> = {
  general: [
    '🎮 심심할 때 딱 좋은 미니게임!\n\n반응속도, 에임, 기억력 테스트:\n👉 https://ddangit.vercel.app',
    '⚡ 얼마나 빠를까?\n\n간단한 미니게임으로 테스트해보세요:\n👉 https://ddangit.vercel.app',
    '🎯 5분만 시간 때우기 딱 좋은 게임\n\n무료 브라우저 게임:\n👉 https://ddangit.vercel.app',
    '🧠 두뇌 트레이닝 미니게임\n\n반응속도부터 기억력까지:\n👉 https://ddangit.vercel.app',
    '😴 심심해? 이거 해봐\n\n미니게임 모음:\n👉 https://ddangit.vercel.app',
  ],
  new_game: [
    '🆕 새 게임 추가!\n\n지금 바로 플레이:\n👉 https://ddangit.vercel.app',
    '🎮 새로운 미니게임이 추가됐어요!\n\n👉 https://ddangit.vercel.app',
  ],
  update: [
    '✨ ddangit 업데이트!\n\n더 재밌어진 미니게임:\n👉 https://ddangit.vercel.app',
    '🚀 게임이 더 좋아졌어요!\n\n👉 https://ddangit.vercel.app',
  ],
  ranking: [
    '🏆 오늘의 랭킹!\n\n{ranking}\n\n도전해보세요:\n👉 https://ddangit.vercel.app',
  ],
};

// 랜덤 템플릿 선택
function pickRandomTemplate(type: MessageType): string {
  const templates = TEMPLATES[type];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 랭킹 포맷팅
function formatRanking(entries: RankingEntry[]): string {
  if (!entries.length) return '아직 기록이 없어요!';

  const medals = ['🥇', '🥈', '🥉'];
  return entries
    .slice(0, 3)
    .map((entry, i) => `${medals[i]} ${entry.nickname}: ${entry.score}`)
    .join('\n');
}

// 메시지 생성
export function generateMessage(context: MessageContext): string {
  let template = pickRandomTemplate(context.type);

  // 랭킹 치환
  if (context.ranking && template.includes('{ranking}')) {
    template = template.replace('{ranking}', formatRanking(context.ranking));
  }

  // 게임명 치환
  if (context.gameName && template.includes('{game}')) {
    template = template.replace('{game}', context.gameName);
  }

  return template;
}

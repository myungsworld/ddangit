// 홍보 메시지 템플릿

import { RankingEntry } from '../storage/types';
import { GAMES } from '@/shared/constants/games';

const BASE_URL = 'https://ddangit.vercel.app';

export type MessageType = 'general' | 'new_game' | 'update' | 'ranking' | 'game_specific';
export type Language = 'ko' | 'en';

interface MessageContext {
  type: MessageType;
  ranking?: RankingEntry[];
  gameName?: string;
  lang?: Language;
  gameId?: string; // 특정 게임 홍보용
}

// 게임 목록 동적 생성 (개행 + 링크 포함)
function getGameListText(): string {
  return GAMES.map(g => `${g.icon} ${g.name}\n👉 ${BASE_URL}${g.path}`).join('\n\n');
}

// 랜덤 게임 선택
function pickRandomGame() {
  return GAMES[Math.floor(Math.random() * GAMES.length)];
}

// 게임별 링크 생성
function getGameUrl(gameId: string): string {
  const game = GAMES.find(g => g.id === gameId);
  return game ? `${BASE_URL}${game.path}` : BASE_URL;
}

// 게임별 홍보 템플릿 (한국어)
const GAME_TEMPLATES_KO: Record<string, string[]> = {
  'sand-tetris': [
    '🧱 모래 테트리스!\n\n같은 색을 좌우로 연결해서 클리어하세요\n👉 {url}',
    '🧱 테트리스 + 모래 물리!\n\n새로운 퍼즐 게임\n👉 {url}',
    '🧱 흙트리스 해봤어?\n\n모래가 쏟아지는 테트리스\n👉 {url}',
  ],
  'reaction-speed': [
    '⚡ 반응속도 테스트!\n\n얼마나 빠를까요?\n👉 {url}',
    '⚡ 당신의 반응속도는?\n\n지금 바로 측정해보세요\n👉 {url}',
  ],
  'aim-trainer': [
    '🎯 에임 트레이너!\n\n타겟을 맞춰보세요\n👉 {url}',
    '🎯 에임 실력 테스트\n\n정확도를 확인해보세요\n👉 {url}',
  ],
};

// 게임별 홍보 템플릿 (영어)
const GAME_TEMPLATES_EN: Record<string, string[]> = {
  'sand-tetris': [
    '🧱 Sand Tetris!\n\nConnect same colors left to right to clear\n👉 {url}',
    '🧱 Tetris + Sand Physics!\n\nA new puzzle game\n👉 {url}',
    '🧱 Ever tried Sand Tetris?\n\nTetris with falling sand\n👉 {url}',
  ],
  'reaction-speed': [
    '⚡ Reaction Speed Test!\n\nHow fast are you?\n👉 {url}',
    '⚡ Test your reflexes!\n\nMeasure your reaction time\n👉 {url}',
  ],
  'aim-trainer': [
    '🎯 Aim Trainer!\n\nHit the targets\n👉 {url}',
    '🎯 Test your aim!\n\nCheck your accuracy\n👉 {url}',
  ],
};

// 메시지 템플릿 풀 (한국어)
const TEMPLATES_KO: Record<MessageType, string[]> = {
  general: [
    '🎮 심심할 때 딱 좋은 미니게임!\n\n{games}',
    '⚡ 간단한 미니게임으로 테스트해보세요!\n\n{games}',
    '🧠 두뇌 트레이닝 미니게임\n\n{games}',
    '😴 심심해? 이거 해봐\n\n{games}',
  ],
  new_game: [
    '🆕 새 게임 추가!\n\n지금 바로 플레이:\n👉 ' + BASE_URL,
    '🎮 새로운 미니게임이 추가됐어요!\n\n👉 ' + BASE_URL,
  ],
  update: [
    '✨ ddangit 업데이트!\n\n더 재밌어진 미니게임:\n👉 ' + BASE_URL,
    '🚀 게임이 더 좋아졌어요!\n\n👉 ' + BASE_URL,
  ],
  ranking: [
    '🏆 오늘의 랭킹!\n\n{ranking}\n\n도전해보세요:\n👉 ' + BASE_URL,
  ],
  game_specific: [], // 동적으로 처리
};

// 메시지 템플릿 풀 (영어)
const TEMPLATES_EN: Record<MessageType, string[]> = {
  general: [
    '🎮 Fun mini-games for your break!\n\n{games}',
    '⚡ Test yourself with simple mini-games!\n\n{games}',
    '🧠 Brain training mini-games\n\n{games}',
    '😴 Bored? Try this!\n\n{games}',
  ],
  new_game: [
    '🆕 New game added!\n\nPlay now:\n👉 ' + BASE_URL,
    '🎮 A new mini-game is here!\n\n👉 ' + BASE_URL,
  ],
  update: [
    '✨ ddangit updated!\n\nMore fun mini-games:\n👉 ' + BASE_URL,
    '🚀 Games just got better!\n\n👉 ' + BASE_URL,
  ],
  ranking: [
    "🏆 Today's ranking!\n\n{ranking}\n\nChallenge yourself:\n👉 " + BASE_URL,
  ],
  game_specific: [], // 동적으로 처리
};

// 언어별 템플릿 맵
const TEMPLATES: Record<Language, Record<MessageType, string[]>> = {
  ko: TEMPLATES_KO,
  en: TEMPLATES_EN,
};

// 언어별 게임 템플릿 맵
const GAME_TEMPLATES: Record<Language, Record<string, string[]>> = {
  ko: GAME_TEMPLATES_KO,
  en: GAME_TEMPLATES_EN,
};

// 랜덤 언어 선택
function pickRandomLanguage(): Language {
  return Math.random() > 0.5 ? 'ko' : 'en';
}

// 랜덤 템플릿 선택
function pickRandomTemplate(type: MessageType, lang: Language, gameId?: string): string {
  // 게임별 홍보인 경우
  if (type === 'game_specific' && gameId) {
    const gameTemplates = GAME_TEMPLATES[lang][gameId];
    if (gameTemplates?.length) {
      return gameTemplates[Math.floor(Math.random() * gameTemplates.length)];
    }
  }

  const templates = TEMPLATES[lang][type];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 랭킹 포맷팅
function formatRanking(entries: RankingEntry[], lang: Language): string {
  if (!entries.length) {
    return lang === 'ko' ? '아직 기록이 없어요!' : 'No records yet!';
  }

  const medals = ['🥇', '🥈', '🥉'];
  return entries
    .slice(0, 3)
    .map((entry, i) => `${medals[i]} ${entry.nickname}: ${entry.score}`)
    .join('\n');
}

// 메시지 생성
export function generateMessage(context: MessageContext): string {
  // 언어 선택: 지정되지 않으면 랜덤
  const lang = context.lang ?? pickRandomLanguage();

  // 게임 ID: 지정되지 않으면 랜덤 (game_specific 타입일 때)
  let gameId = context.gameId;
  if (context.type === 'game_specific' && !gameId) {
    gameId = pickRandomGame().id;
  }

  let template = pickRandomTemplate(context.type, lang, gameId);

  // URL 치환 (게임별 링크)
  if (template.includes('{url}') && gameId) {
    template = template.replace('{url}', getGameUrl(gameId));
  }

  // 게임 목록 치환
  if (template.includes('{games}')) {
    template = template.replace('{games}', getGameListText());
  }

  // 랭킹 치환
  if (context.ranking && template.includes('{ranking}')) {
    template = template.replace('{ranking}', formatRanking(context.ranking, lang));
  }

  // 게임명 치환
  if (context.gameName && template.includes('{game}')) {
    template = template.replace('{game}', context.gameName);
  }

  return template;
}

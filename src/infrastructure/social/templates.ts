// 홍보 메시지 템플릿

import { RankingEntry } from '../storage/types';
import { GAMES } from '@/shared/constants/games';
import { pickRandomHashtags } from './types';

const BASE_URL = 'https://ddangit.vercel.app';

export type MessageType = 'general' | 'new_game' | 'update' | 'ranking';
export type Language = 'ko' | 'en';

export type Platform = 'twitter' | 'bluesky';

interface MessageContext {
  type: MessageType;
  ranking?: RankingEntry[];
  lang?: Language;
  includeHashtags?: boolean; // 해시태그 포함 여부 (기본: true)
  platform?: Platform; // 플랫폼별 메시지 길이 조절
}

// 배열에서 랜덤 n개 선택
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// 게임 목록 동적 생성 (랜덤 3개 + 메인 링크)
function getGameListText(): string {
  const randomGames = pickRandom(GAMES, 3);
  const gameList = randomGames.map(g => `${g.icon} ${g.name}\n👉 ${BASE_URL}${g.path}`).join('\n\n');
  // 마지막에 메인 링크 추가 (트위터 카드가 메인 페이지를 보여주도록)
  return `${gameList}\n\n🏠 More Games\n👉 ${BASE_URL}`;
}

// Bluesky용 짧은 게임 목록 (300자 제한, 랜덤 3개)
function getGameListTextShort(): string {
  const randomGames = pickRandom(GAMES, 3);
  const gameList = randomGames.map(g => `${g.icon} ${g.name}`).join('\n');
  return `${gameList}\n\n👉 ${BASE_URL}`;
}

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
};

// 언어별 템플릿 맵
const TEMPLATES: Record<Language, Record<MessageType, string[]>> = {
  ko: TEMPLATES_KO,
  en: TEMPLATES_EN,
};

// 랜덤 언어 선택
function pickRandomLanguage(): Language {
  return Math.random() > 0.5 ? 'ko' : 'en';
}

// 랜덤 템플릿 선택
function pickRandomTemplate(type: MessageType, lang: Language): string {
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

  let template = pickRandomTemplate(context.type, lang);

  // 게임 목록 치환 (플랫폼에 따라 길이 조절)
  if (template.includes('{games}')) {
    const gameText = context.platform === 'bluesky'
      ? getGameListTextShort()
      : getGameListText();
    template = template.replace('{games}', gameText);
  }

  // 랭킹 치환
  if (context.ranking && template.includes('{ranking}')) {
    template = template.replace('{ranking}', formatRanking(context.ranking, lang));
  }

  // 해시태그 추가 (기본: true, Bluesky는 제외 - 글자수 절약)
  if (context.includeHashtags !== false && context.platform !== 'bluesky') {
    const hashtags = pickRandomHashtags(3, lang);
    template = `${template}\n\n${hashtags.join(' ')}`;
  }

  return template;
}

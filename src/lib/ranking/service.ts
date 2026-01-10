// 랭킹 서비스
// Storage adapter를 통해 데이터 저장/조회

import { getStorage, RankingEntry, todayDate } from '@/infrastructure/storage';
import { RankCheckResult, SubmitResult, GAME_SCORE_ORDER, ScoreOrder } from './types';

const MAX_RANK = 3;

// 점수 비교 함수
function compareScores(a: number, b: number, order: ScoreOrder): number {
  return order === 'asc' ? a - b : b - a;
}

// 점수가 랭킹에 들어갈 수 있는지 확인
export async function checkRank(gameId: string, score: number): Promise<RankCheckResult> {
  const storage = await getStorage();
  const date = todayDate();
  const entries = await storage.getRanking(gameId, date);
  const order = GAME_SCORE_ORDER[gameId] || 'desc';

  // 현재 Top 3
  const currentTop3 = entries.slice(0, MAX_RANK).map((e) => ({
    rank: e.rank,
    nickname: e.nickname,
    score: e.score,
    createdAt: e.createdAt,
  }));

  // 빈 자리가 있으면 무조건 랭크 가능
  if (entries.length < MAX_RANK) {
    return {
      isTopRank: true,
      rank: entries.length + 1,
      currentTop3,
    };
  }

  // 마지막 랭커보다 나은지 확인
  const lastEntry = entries[MAX_RANK - 1];
  const isBetter = compareScores(score, lastEntry.score, order) < 0;

  if (isBetter) {
    // 몇 등인지 계산
    let rank = MAX_RANK;
    for (let i = 0; i < entries.length && i < MAX_RANK; i++) {
      if (compareScores(score, entries[i].score, order) < 0) {
        rank = i + 1;
        break;
      }
    }
    return { isTopRank: true, rank, currentTop3 };
  }

  return { isTopRank: false, rank: null, currentTop3 };
}

// 랭킹 제출
export async function submitScore(
  gameId: string,
  score: number,
  nickname: string
): Promise<SubmitResult> {
  const storage = await getStorage();
  const date = todayDate();
  const order = GAME_SCORE_ORDER[gameId] || 'desc';

  // 현재 랭킹 조회
  const entries = await storage.getRanking(gameId, date);

  // 새 엔트리
  const newEntry: RankingEntry = {
    rank: 0, // 아래에서 재계산
    nickname: nickname.slice(0, 10), // 최대 10자
    score,
    gameId,
    date,
    createdAt: new Date().toISOString(),
  };

  // 기존 엔트리에 추가
  const allEntries = [...entries, newEntry];

  // 정렬
  allEntries.sort((a, b) => compareScores(a.score, b.score, order));

  // 상위 3개만 유지, 랭크 재계산
  const top3 = allEntries.slice(0, MAX_RANK).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  // 새 엔트리가 Top 3에 포함되는지 확인
  const newEntryRank = top3.findIndex(
    (e) => e.score === newEntry.score && e.createdAt === newEntry.createdAt
  );

  if (newEntryRank === -1) {
    return {
      success: false,
      rank: null,
      message: 'Score did not make top 3',
    };
  }

  await storage.setRanking(gameId, date, top3);

  return {
    success: true,
    rank: newEntryRank + 1,
    message: `Ranked #${newEntryRank + 1}!`,
  };
}

// 오늘의 랭킹 조회
export async function getTodayRanking(gameId: string): Promise<RankingEntry[]> {
  const storage = await getStorage();
  const date = todayDate();
  return storage.getRanking(gameId, date);
}

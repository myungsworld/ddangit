import { NextRequest, NextResponse } from 'next/server';
import { checkRank, submitScore, getTodayRanking } from '@/lib/ranking';

// GET /api/ranking?gameId=xxx
// 오늘의 랭킹 조회
export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get('gameId');
  const debug = request.nextUrl.searchParams.get('debug');

  // 디버그 모드: 환경변수 확인
  if (debug === 'env') {
    return NextResponse.json({
      STORAGE_TYPE: process.env.STORAGE_TYPE,
      KV_REST_API_URL: process.env.KV_REST_API_URL?.slice(0, 30) + '...',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'set' : 'not set',
    });
  }

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  try {
    const ranking = await getTodayRanking(gameId);
    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('[Ranking] GET error:', error);
    return NextResponse.json({
      error: 'Failed to get ranking',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// POST /api/ranking
// 점수 확인 또는 제출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, score, nickname, action = 'check' } = body as {
      gameId: string;
      score: number;
      nickname?: string;
      action?: 'check' | 'submit';
    };

    if (!gameId || score === undefined) {
      return NextResponse.json(
        { error: 'gameId and score are required' },
        { status: 400 }
      );
    }

    // 점수가 랭킹에 드는지 확인만
    if (action === 'check') {
      const result = await checkRank(gameId, score);
      return NextResponse.json(result);
    }

    // 실제 제출
    if (action === 'submit') {
      if (!nickname) {
        return NextResponse.json(
          { error: 'nickname is required for submit' },
          { status: 400 }
        );
      }

      const result = await submitScore(gameId, score, nickname);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Ranking] POST error:', error);
    return NextResponse.json({ error: 'Failed to process ranking' }, { status: 500 });
  }
}

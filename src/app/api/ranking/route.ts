import { NextRequest, NextResponse } from 'next/server';
import { checkRank, submitScore, getTodayRanking } from '@/lib/ranking';

// GET /api/ranking?gameId=xxx
export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  try {
    const ranking = await getTodayRanking(gameId);
    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('[Ranking] GET error:', error);
    return NextResponse.json({ error: 'Failed to get ranking' }, { status: 500 });
  }
}

// POST /api/ranking
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
      return NextResponse.json({ error: 'gameId and score are required' }, { status: 400 });
    }

    if (action === 'check') {
      const result = await checkRank(gameId, score);
      return NextResponse.json(result);
    }

    if (action === 'submit') {
      if (!nickname) {
        return NextResponse.json({ error: 'nickname is required for submit' }, { status: 400 });
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

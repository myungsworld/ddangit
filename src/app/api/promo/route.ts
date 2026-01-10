import { NextRequest, NextResponse } from 'next/server';
import { postTweet, generatePromoMessage } from '@/lib/promo/twitter';
import { logPromoResult, logPromoRun } from '@/lib/promo/logger';
import { PromoResult } from '@/lib/promo/types';

// 지원 플랫폼 목록
const PLATFORMS = ['twitter'] as const;

// GET /api/promo - 전체 상태 확인
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platforms: PLATFORMS.map((p) => ({
      name: p,
      endpoint: `/api/promo/${p}`,
    })),
    usage: {
      'GET /api/promo': '전체 상태 확인',
      'GET /api/promo/[platform]': '플랫폼 상태 (Cron 트리거)',
      'POST /api/promo/[platform]': '수동 발송',
      'POST /api/promo': '전체 플랫폼 발송',
    },
  });
}

// POST /api/promo - 모든 플랫폼에 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'general', customMessage } = body as {
      type?: 'new_game' | 'update' | 'general';
      customMessage?: string;
    };

    const message = customMessage || generatePromoMessage(type);
    const results: PromoResult[] = [];

    // Twitter 발송
    const twitterResult = await postTweet(message);
    logPromoResult(twitterResult);
    results.push(twitterResult);

    // 다른 플랫폼 추가 시 여기에 추가
    // const discordResult = await postDiscord(message);
    // results.push(discordResult);

    const log = logPromoRun(results, message);

    return NextResponse.json({
      success: results.every((r) => r.status === 'success'),
      summary: {
        total: results.length,
        success: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'failed').length,
      },
      results: results.map((r) => ({
        platform: r.platform,
        success: r.status === 'success',
        postUrl: r.postUrl,
        error: r.error,
      })),
      logId: log.id,
    });
  } catch (error) {
    console.error('[Promo] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { postTweet, generatePromoMessage } from '@/lib/promo/twitter';
import { logPromoResult } from '@/lib/promo/logger';

// GET /api/promo/twitter - Cron 또는 상태 확인
export async function GET(request: NextRequest) {
  const isCron = request.headers.get('x-vercel-cron') === '1';

  if (isCron) {
    console.log('[Promo][Twitter] Cron triggered at', new Date().toISOString());

    const message = generatePromoMessage('general');
    const result = await postTweet(message);
    logPromoResult(result);

    return NextResponse.json({
      success: result.status === 'success',
      postUrl: result.postUrl,
      message: result.message,
    });
  }

  return NextResponse.json({
    platform: 'twitter',
    status: 'ok',
    schedule: 'Daily at 09:00 UTC',
  });
}

// POST /api/promo/twitter - 수동 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'general', customMessage } = body as {
      type?: 'new_game' | 'update' | 'general';
      customMessage?: string;
    };

    const message = customMessage || generatePromoMessage(type);
    const result = await postTweet(message);
    logPromoResult(result);

    return NextResponse.json({
      success: result.status === 'success',
      platform: 'twitter',
      postId: result.postId,
      postUrl: result.postUrl,
      message: result.message,
      error: result.error,
    });
  } catch (error) {
    console.error('[Promo][Twitter] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

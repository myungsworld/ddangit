import { NextRequest, NextResponse } from 'next/server';
import { getSocialAdapter } from '@/infrastructure/social';
import { generateMessage } from '@/infrastructure/social/templates';

// GET /api/promo/twitter - Cron 또는 상태 확인
export async function GET(request: NextRequest) {
  const isCron = request.headers.get('x-vercel-cron') === '1';
  const adapter = getSocialAdapter('twitter');

  if (isCron) {
    console.log('[Promo][Twitter] Cron triggered at', new Date().toISOString());

    const message = generateMessage({ type: 'general' });
    const result = await adapter.post({ text: message });

    console.log(`[Promo][Twitter] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);

    return NextResponse.json({
      success: result.status === 'success',
      postUrl: result.postUrl,
      message: result.message,
    });
  }

  return NextResponse.json({
    platform: 'twitter',
    status: 'ok',
    configured: adapter.isConfigured(),
    schedule: 'Daily at 09:00 UTC',
  });
}

// POST /api/promo/twitter - 수동 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'general', customMessage } = body as {
      type?: 'general' | 'new_game' | 'update' | 'ranking';
      customMessage?: string;
    };

    const adapter = getSocialAdapter('twitter');
    const message = customMessage || generateMessage({ type });
    const result = await adapter.post({ text: message });

    console.log(`[Promo][Twitter] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);

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

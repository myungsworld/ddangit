import { NextRequest, NextResponse } from 'next/server';
import { getSocialAdapter } from '@/infrastructure/social';
import { generateMessage, MessageType } from '@/infrastructure/social/templates';
import { isAuthorized } from '@/infrastructure/social/auth';

// GET /api/promo/twitter - Cron 전용
export async function GET(request: NextRequest) {
  // Vercel Cron만 허용 (Vercel이 자동으로 서명 검증)
  const isCron = request.headers.get('x-vercel-cron') === '1';

  if (!isCron) {
    // Cron이 아니면 상태만 반환 (트윗 발송 안함)
    const adapter = getSocialAdapter('twitter');
    return NextResponse.json({
      platform: 'twitter',
      status: 'ok',
      configured: adapter.isConfigured(),
      schedule: 'Daily at 09:00 UTC',
    });
  }

  console.log('[Promo][Twitter] Cron triggered at', new Date().toISOString());

  const adapter = getSocialAdapter('twitter');
  const message = generateMessage({ type: 'general' });
  const result = await adapter.post({ text: message });

  console.log(`[Promo][Twitter] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);

  return NextResponse.json({
    success: result.status === 'success',
    postUrl: result.postUrl,
    message: result.message,
  });
}

// POST /api/promo/twitter - 수동 발송 (로컬 또는 API 키 필요)
export async function POST(request: NextRequest) {
  // 권한 검증
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Twitter API 설정 확인
  const adapter = getSocialAdapter('twitter');
  if (!adapter.isConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Twitter API not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'general', customMessage } = body as {
      type?: MessageType;
      customMessage?: string;
    };

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

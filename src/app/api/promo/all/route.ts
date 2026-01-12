import { NextRequest, NextResponse } from 'next/server';
import { getSocialAdapter, PostResult } from '@/infrastructure/social';
import { generateMessage } from '@/infrastructure/social/templates';
import { sendPromoResultEmail } from '@/infrastructure/notification/email';
import { isAuthorized } from '@/infrastructure/social/auth';

// GET /api/promo/all - Cron 전용 (모든 플랫폼에 발송)
export async function GET(request: NextRequest) {
  const isCron = request.headers.get('x-vercel-cron') === '1';

  if (!isCron) {
    // Cron이 아니면 상태만 반환
    const twitter = getSocialAdapter('twitter');
    const bluesky = getSocialAdapter('bluesky');

    return NextResponse.json({
      status: 'ok',
      platforms: {
        twitter: twitter.isConfigured(),
        bluesky: bluesky.isConfigured(),
      },
      schedule: 'Daily at 09:00 UTC',
    });
  }

  console.log('[Promo][All] Cron triggered at', new Date().toISOString());

  const results: PostResult[] = [];

  // Twitter 발송 (한국어/영어 랜덤)
  try {
    const twitter = getSocialAdapter('twitter');
    if (twitter.isConfigured()) {
      const message = generateMessage({ type: 'general', platform: 'twitter' });
      const result = await twitter.post({ text: message });
      results.push(result);
      console.log(`[Promo][Twitter] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);
    } else {
      results.push({
        platform: 'twitter',
        status: 'skipped',
        message: 'Not configured',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    results.push({
      platform: 'twitter',
      status: 'failed',
      message: 'Unexpected error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Bluesky 발송 (영어 전용, 짧은 메시지)
  try {
    const bluesky = getSocialAdapter('bluesky');
    if (bluesky.isConfigured()) {
      const message = generateMessage({ type: 'general', lang: 'en', platform: 'bluesky' });
      const result = await bluesky.post({ text: message });
      results.push(result);
      console.log(`[Promo][Bluesky] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);
    } else {
      results.push({
        platform: 'bluesky',
        status: 'skipped',
        message: 'Not configured',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    results.push({
      platform: 'bluesky',
      status: 'failed',
      message: 'Unexpected error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // 실패 시 이메일 알림
  await sendPromoResultEmail(results);

  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return NextResponse.json({
    success: failedCount === 0,
    summary: `${successCount} succeeded, ${failedCount} failed`,
    results,
  });
}

// POST /api/promo/all - 수동 발송 (로컬 또는 API 키 필요)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { platforms = ['twitter', 'bluesky'] } = body as {
      platforms?: ('twitter' | 'bluesky')[];
    };

    const results: PostResult[] = [];

    for (const platform of platforms) {
      try {
        const adapter = getSocialAdapter(platform);

        if (!adapter.isConfigured()) {
          results.push({
            platform,
            status: 'skipped',
            message: `${platform} not configured`,
            timestamp: new Date().toISOString(),
          });
          continue;
        }

        // Bluesky는 영어 + 짧은 메시지, Twitter는 랜덤
        const lang = platform === 'bluesky' ? 'en' : undefined;
        const message = generateMessage({ type: 'general', lang, platform });
        const result = await adapter.post({ text: message });
        results.push(result);

        console.log(`[Promo][${platform}] ${result.status === 'success' ? '✅' : '❌'} ${result.message}`);
      } catch (error) {
        results.push({
          platform,
          status: 'failed',
          message: 'Unexpected error',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // 실패 시 이메일 알림
    await sendPromoResultEmail(results);

    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: failedCount === 0,
      summary: `${successCount} succeeded, ${failedCount} failed`,
      results,
    });
  } catch (error) {
    console.error('[Promo][All] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

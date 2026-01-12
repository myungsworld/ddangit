import { NextRequest, NextResponse } from 'next/server';
import { getSocialAdapter, getAllPlatforms, PostResult, Platform } from '@/infrastructure/social';
import { generateMessage } from '@/infrastructure/social/templates';
import { sendPromoResultEmail } from '@/infrastructure/notification/email';
import { isAuthorized } from '@/infrastructure/social/auth';

// 플랫폼별 메시지 생성 옵션
function getMessageOptions(platform: Platform) {
  // Bluesky는 영어 전용, 짧은 메시지
  if (platform === 'bluesky') {
    return { type: 'general' as const, lang: 'en' as const, platform };
  }
  // 기본: 랜덤 언어
  return { type: 'general' as const, platform };
}

// 모든 플랫폼에 발송하는 공통 로직
async function postToAllPlatforms(platforms: Platform[]): Promise<PostResult[]> {
  const results: PostResult[] = [];

  for (const platform of platforms) {
    try {
      const adapter = getSocialAdapter(platform);

      if (!adapter.isConfigured()) {
        results.push({
          platform,
          status: 'skipped',
          message: 'Not configured',
          timestamp: new Date().toISOString(),
        });
        continue;
      }

      const message = generateMessage(getMessageOptions(platform));
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

  return results;
}

// GET /api/promo/all - 상태 확인용
export async function GET() {
  const allPlatforms = getAllPlatforms();
  const platformStatus: Record<string, boolean> = {};

  for (const platform of allPlatforms) {
    platformStatus[platform] = getSocialAdapter(platform).isConfigured();
  }

  return NextResponse.json({
    status: 'ok',
    platforms: platformStatus,
    schedule: 'Daily at 09:00 UTC (GitHub Actions)',
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
    // platforms가 없으면 모든 플랫폼에 발송
    const { platforms } = body as { platforms?: Platform[] };
    const targetPlatforms = platforms ?? getAllPlatforms();

    const results = await postToAllPlatforms(targetPlatforms);

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

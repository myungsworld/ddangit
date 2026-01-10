import { NextRequest, NextResponse } from 'next/server';
import { postToAllPlatforms, PostResult } from '@/infrastructure/social';
import { generateMessage } from '@/infrastructure/social/templates';

// GET /api/promo - 전체 상태 확인
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platforms: ['twitter', 'discord'],
    usage: {
      'GET /api/promo': '전체 상태 확인',
      'GET /api/promo/[platform]': '플랫폼 상태 (Cron 트리거)',
      'POST /api/promo/[platform]': '수동 발송',
      'POST /api/promo': '전체 플랫폼 발송',
    },
  });
}

// POST /api/promo - 모든 활성 플랫폼에 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = 'general', customMessage } = body as {
      type?: 'general' | 'new_game' | 'update' | 'ranking';
      customMessage?: string;
    };

    const message = customMessage || generateMessage({ type });

    const results = await postToAllPlatforms({ text: message });

    logResults(results, message);

    return NextResponse.json({
      success: results.every((r) => r.status === 'success'),
      summary: {
        total: results.length,
        success: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'failed').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
      },
      results,
    });
  } catch (error) {
    console.error('[Promo] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 로그 출력
function logResults(results: PostResult[], message: string) {
  console.log('═'.repeat(50));
  console.log('[Promo] RUN SUMMARY');
  console.log('═'.repeat(50));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Message: ${message.substring(0, 80)}...`);
  console.log('─'.repeat(50));

  const success = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  console.log(`Results: ✅ ${success} | ❌ ${failed} | ⏭️ ${skipped}`);

  results.forEach((r) => {
    const icon = r.status === 'success' ? '✅' : r.status === 'failed' ? '❌' : '⏭️';
    console.log(`  ${icon} ${r.platform}: ${r.message}${r.postUrl ? ` (${r.postUrl})` : ''}`);
  });

  console.log('═'.repeat(50));
}

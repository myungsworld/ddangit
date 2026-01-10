import { PromoResult, PromoLog } from './types';

// 플랫폼별 상세 로그 출력 (Vercel Logs에서 검색 가능)
export function logPromoResult(result: PromoResult): void {
  const prefix = `[Promo][${result.platform.toUpperCase()}]`;
  const timestamp = result.timestamp;

  if (result.status === 'success') {
    console.log(`${prefix} ✅ SUCCESS`, {
      timestamp,
      postId: result.postId,
      postUrl: result.postUrl,
      message: result.message,
    });
  } else if (result.status === 'failed') {
    console.error(`${prefix} ❌ FAILED`, {
      timestamp,
      message: result.message,
      error: result.error,
    });
  } else {
    console.log(`${prefix} ⏭️ SKIPPED`, {
      timestamp,
      message: result.message,
    });
  }
}

// 전체 실행 결과 요약 로그
export function logPromoRun(results: PromoResult[], content: string): PromoLog {
  const log: PromoLog = {
    id: `promo_${Date.now()}`,
    results,
    content,
    createdAt: new Date().toISOString(),
  };

  const successCount = results.filter((r) => r.status === 'success').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;
  const skippedCount = results.filter((r) => r.status === 'skipped').length;

  console.log('═'.repeat(50));
  console.log('[Promo] RUN SUMMARY');
  console.log('═'.repeat(50));
  console.log(`ID: ${log.id}`);
  console.log(`Time: ${log.createdAt}`);
  console.log(`Content: ${content.substring(0, 100)}...`);
  console.log('─'.repeat(50));
  console.log(`Results: ✅ ${successCount} | ❌ ${failedCount} | ⏭️ ${skippedCount}`);

  results.forEach((r) => {
    const icon = r.status === 'success' ? '✅' : r.status === 'failed' ? '❌' : '⏭️';
    console.log(`  ${icon} ${r.platform}: ${r.message}${r.postUrl ? ` (${r.postUrl})` : ''}`);
  });

  console.log('═'.repeat(50));

  return log;
}

export function formatLogSummary(log: PromoLog): string {
  const successCount = log.results.filter((r) => r.status === 'success').length;
  const total = log.results.length;
  return `[${log.createdAt}] ${successCount}/${total} platforms succeeded`;
}

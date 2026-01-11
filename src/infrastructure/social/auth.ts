// 프로모션 API 인증 유틸리티

import { NextRequest } from 'next/server';

// 요청 권한 검증
export function isAuthorized(request: NextRequest): boolean {
  // 1. 로컬 환경은 항상 허용
  const host = request.headers.get('host') || '';
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return true;
  }

  // 2. API 키 검증 (프로덕션 수동 발송용)
  const apiKey = request.headers.get('x-api-key');
  const validKey = process.env.PROMO_API_KEY;
  if (validKey && apiKey === validKey) {
    return true;
  }

  return false;
}

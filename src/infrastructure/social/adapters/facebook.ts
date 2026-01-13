// Facebook Page Adapter (Graph API)
// 특별 기능: Link Preview + Call-to-Action 버튼

import { SocialAdapter, PostResult, PostOptions } from '../types';

const FACEBOOK_API_URL = 'https://graph.facebook.com/v24.0';

// Facebook CTA 버튼 타입
type FacebookCTAType =
  | 'PLAY_GAME'      // 게임 플레이
  | 'LEARN_MORE'     // 더 알아보기
  | 'SIGN_UP'        // 가입하기
  | 'SHOP_NOW'       // 지금 쇼핑
  | 'BOOK_NOW'       // 지금 예약
  | 'WATCH_MORE'     // 더 보기
  | 'NO_BUTTON';     // 버튼 없음

interface FacebookPostOptions extends PostOptions {
  // 링크 프리뷰 (OG 이미지 자동 생성)
  link?: string;
  // Call-to-Action 버튼 타입
  ctaType?: FacebookCTAType;
}

export class FacebookAdapter implements SocialAdapter {
  platform = 'facebook' as const;

  isConfigured(): boolean {
    return !!(
      process.env.FACEBOOK_PAGE_ID &&
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    );
  }

  async post(options: FacebookPostOptions): Promise<PostResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        platform: 'facebook',
        status: 'skipped',
        message: 'Facebook API not configured',
        timestamp,
      };
    }

    try {
      const pageId = process.env.FACEBOOK_PAGE_ID!;
      const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

      // 해시태그가 있으면 추가
      const message = options.tags?.length
        ? `${options.text}\n\n${options.tags.join(' ')}`
        : options.text;

      // 요청 파라미터 구성
      const params = new URLSearchParams({
        message,
        access_token: accessToken,
      });

      // 링크가 있으면 추가 (OG 이미지 프리뷰 자동 생성)
      const link = options.link || 'https://ddangit.vercel.app';
      params.append('link', link);

      // Call-to-Action 버튼 추가 (기본: PLAY_GAME)
      const ctaType = options.ctaType || 'PLAY_GAME';
      if (ctaType !== 'NO_BUTTON') {
        const callToAction = JSON.stringify({
          type: ctaType,
          value: { link },
        });
        params.append('call_to_action', callToAction);
      }

      const response = await fetch(`${FACEBOOK_API_URL}/${pageId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Facebook] API Error:', data);
        return {
          platform: 'facebook',
          status: 'failed',
          message: `API Error: ${response.status}`,
          timestamp,
          error: JSON.stringify(data),
        };
      }

      const postId = data.id;
      // Facebook 포스트 URL 형식: https://www.facebook.com/{post_id}
      const postUrl = postId ? `https://www.facebook.com/${postId}` : undefined;

      return {
        platform: 'facebook',
        status: 'success',
        message: 'Post created successfully',
        postId,
        postUrl,
        timestamp,
      };
    } catch (error) {
      console.error('[Facebook] Error:', error);
      return {
        platform: 'facebook',
        status: 'failed',
        message: 'Failed to create post',
        timestamp,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

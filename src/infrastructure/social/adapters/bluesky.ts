// Bluesky Adapter (AT Protocol)

import { SocialAdapter, PostResult, PostOptions } from '../types';

const BLUESKY_API_URL = 'https://bsky.social/xrpc';

// Bluesky facet 타입 정의
interface BlueskyFacet {
  index: { byteStart: number; byteEnd: number };
  features: Array<{ $type: string; uri?: string; tag?: string }>;
}

// 텍스트에서 URL을 찾아 facets 생성
function extractLinkFacets(text: string): BlueskyFacet[] {
  const facets: BlueskyFacet[] = [];
  const urlRegex = /https?:\/\/[^\s]+/g;
  let match;

  // UTF-8 바이트 위치 계산을 위해 TextEncoder 사용
  const encoder = new TextEncoder();

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const beforeText = text.slice(0, match.index);
    const byteStart = encoder.encode(beforeText).length;
    const byteEnd = byteStart + encoder.encode(url).length;

    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }

  return facets;
}

export class BlueskyAdapter implements SocialAdapter {
  platform = 'bluesky' as const;

  isConfigured(): boolean {
    return !!(
      process.env.BLUESKY_IDENTIFIER &&
      process.env.BLUESKY_PASSWORD
    );
  }

  private async createSession(): Promise<{ accessJwt: string; did: string; error?: string } | null> {
    try {
      const identifier = process.env.BLUESKY_IDENTIFIER;
      const password = process.env.BLUESKY_PASSWORD;

      console.log(`[Bluesky] Creating session for: ${identifier}`);

      const response = await fetch(`${BLUESKY_API_URL}/com.atproto.server.createSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Bluesky] Session creation failed:', JSON.stringify(data));
        return { accessJwt: '', did: '', error: JSON.stringify(data) };
      }

      return { accessJwt: data.accessJwt, did: data.did };
    } catch (error) {
      console.error('[Bluesky] Session error:', error);
      return { accessJwt: '', did: '', error: error instanceof Error ? error.message : String(error) };
    }
  }

  async post(options: PostOptions): Promise<PostResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        platform: 'bluesky',
        status: 'skipped',
        message: 'Bluesky API not configured',
        timestamp,
      };
    }

    try {
      // 세션 생성
      const session = await this.createSession();
      if (!session || !session.accessJwt) {
        return {
          platform: 'bluesky',
          status: 'failed',
          message: 'Failed to create session',
          timestamp,
          error: session?.error || 'Unknown error',
        };
      }

      // 해시태그가 있으면 추가
      const text = options.tags?.length
        ? `${options.text}\n\n${options.tags.join(' ')}`
        : options.text;

      // URL을 클릭 가능하게 하기 위한 facets 추출
      const facets = extractLinkFacets(text);

      // 포스트 생성 (facets 포함)
      const record: Record<string, unknown> = {
        text,
        createdAt: timestamp,
      };

      // facets가 있으면 추가
      if (facets.length > 0) {
        record.facets = facets;
      }

      const response = await fetch(`${BLUESKY_API_URL}/com.atproto.repo.createRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessJwt}`,
        },
        body: JSON.stringify({
          repo: session.did,
          collection: 'app.bsky.feed.post',
          record,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Bluesky] Post failed:', data);
        return {
          platform: 'bluesky',
          status: 'failed',
          message: `API Error: ${response.status}`,
          timestamp,
          error: JSON.stringify(data),
        };
      }

      // URI에서 post ID 추출
      const uri = data.uri as string;
      const postId = uri?.split('/').pop();
      const handle = process.env.BLUESKY_IDENTIFIER?.replace('@', '');
      const postUrl = postId ? `https://bsky.app/profile/${handle}/post/${postId}` : undefined;

      return {
        platform: 'bluesky',
        status: 'success',
        message: 'Post created successfully',
        postId,
        postUrl,
        timestamp,
      };
    } catch (error) {
      console.error('[Bluesky] Error:', error);
      return {
        platform: 'bluesky',
        status: 'failed',
        message: 'Failed to create post',
        timestamp,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

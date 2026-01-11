// Twitter/X Adapter

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { SocialAdapter, PostResult, PostOptions } from '../types';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

export class TwitterAdapter implements SocialAdapter {
  platform = 'twitter' as const;

  private getOAuthClient(): OAuth {
    return new OAuth({
      consumer: {
        key: process.env.TWITTER_API_KEY!,
        secret: process.env.TWITTER_API_SECRET!,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
      },
    });
  }

  isConfigured(): boolean {
    return !!(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );
  }

  async post(options: PostOptions): Promise<PostResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        platform: 'twitter',
        status: 'skipped',
        message: 'Twitter API not configured',
        timestamp,
      };
    }

    try {
      const oauth = this.getOAuthClient();
      const token = {
        key: process.env.TWITTER_ACCESS_TOKEN!,
        secret: process.env.TWITTER_ACCESS_SECRET!,
      };

      const requestData = {
        url: TWITTER_API_URL,
        method: 'POST' as const,
      };

      const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

      // 해시태그는 이미 템플릿에 포함되어 있음
      // 커스텀 태그가 있으면 추가
      const text = options.tags?.length
        ? `${options.text}\n\n${options.tags.join(' ')}`
        : options.text;

      const response = await fetch(TWITTER_API_URL, {
        method: 'POST',
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Twitter] API Error:', data);
        return {
          platform: 'twitter',
          status: 'failed',
          message: `API Error: ${response.status}`,
          timestamp,
          error: JSON.stringify(data),
        };
      }

      const tweetId = data.data?.id;
      const postUrl = tweetId ? `https://twitter.com/i/web/status/${tweetId}` : undefined;

      return {
        platform: 'twitter',
        status: 'success',
        message: 'Tweet posted successfully',
        postId: tweetId,
        postUrl,
        timestamp,
      };
    } catch (error) {
      console.error('[Twitter] Error:', error);
      return {
        platform: 'twitter',
        status: 'failed',
        message: 'Failed to post tweet',
        timestamp,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

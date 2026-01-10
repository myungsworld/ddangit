import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { PromoResult, TweetPayload } from './types';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

// OAuth 1.0a 설정
function getOAuthClient() {
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

// 트윗 발송
export async function postTweet(text: string): Promise<PromoResult> {
  const timestamp = new Date().toISOString();

  try {
    const oauth = getOAuthClient();
    const token = {
      key: process.env.TWITTER_ACCESS_TOKEN!,
      secret: process.env.TWITTER_ACCESS_SECRET!,
    };

    const requestData = {
      url: TWITTER_API_URL,
      method: 'POST' as const,
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

    const payload: TweetPayload = { text };

    const response = await fetch(TWITTER_API_URL, {
      method: 'POST',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
    const postUrl = tweetId
      ? `https://twitter.com/i/web/status/${tweetId}`
      : undefined;

    console.log('[Twitter] Tweet posted successfully:', tweetId);

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

// 홍보 메시지 템플릿
export function generatePromoMessage(type: 'new_game' | 'update' | 'general'): string {
  const messages = {
    new_game: [
      '🎮 New game added to ddangit!\n\nTry our free browser mini-games:\n👉 https://ddangit.vercel.app\n\n#webgames #indiegames #browsergames',
      '🕹️ Check out our new mini-game!\n\nFree to play, no download needed:\n👉 https://ddangit.vercel.app\n\n#gaming #casualgames',
    ],
    update: [
      '✨ ddangit updated!\n\nNew features and improvements. Test your skills:\n👉 https://ddangit.vercel.app\n\n#webgames #update',
      '🚀 Fresh update on ddangit!\n\nBetter gameplay, more fun:\n👉 https://ddangit.vercel.app\n\n#indiegames #gaming',
    ],
    general: [
      '🎯 How fast are your reflexes?\n\nTest yourself with our free mini-games:\n👉 https://ddangit.vercel.app\n\n#reactiontest #gaming',
      '⚡ Can you beat the average?\n\nReaction test, aim trainer, and more:\n👉 https://ddangit.vercel.app\n\n#browsergames #challenge',
    ],
  };

  const typeMessages = messages[type];
  return typeMessages[Math.floor(Math.random() * typeMessages.length)];
}

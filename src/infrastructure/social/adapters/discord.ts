// Discord Webhook Adapter (향후 확장용)

import { SocialAdapter, PostResult, PostOptions } from '../types';

export class DiscordAdapter implements SocialAdapter {
  platform = 'discord' as const;

  isConfigured(): boolean {
    return !!process.env.DISCORD_WEBHOOK_URL;
  }

  async post(options: PostOptions): Promise<PostResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        platform: 'discord',
        status: 'skipped',
        message: 'Discord Webhook not configured',
        timestamp,
      };
    }

    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: options.text,
          // embeds 추가 가능
        }),
      });

      if (!response.ok) {
        return {
          platform: 'discord',
          status: 'failed',
          message: `Webhook Error: ${response.status}`,
          timestamp,
        };
      }

      return {
        platform: 'discord',
        status: 'success',
        message: 'Discord message sent',
        timestamp,
      };
    } catch (error) {
      return {
        platform: 'discord',
        status: 'failed',
        message: 'Failed to send Discord message',
        timestamp,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

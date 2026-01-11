// 이메일 알림 서비스 (Resend)

const RESEND_API_URL = 'https://api.resend.com/emails';

interface EmailOptions {
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    console.log('[Email] Not configured, skipping notification');
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'ddangit <noreply@resend.dev>',
        to: [toEmail],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email] Failed to send:', error);
      return false;
    }

    console.log('[Email] Notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Email] Error:', error);
    return false;
  }
}

// 프로모션 결과 알림
export async function sendPromoResultEmail(results: {
  platform: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  postUrl?: string;
  error?: string;
}[]): Promise<void> {
  const failed = results.filter(r => r.status === 'failed');
  const success = results.filter(r => r.status === 'success');
  const skipped = results.filter(r => r.status === 'skipped');

  const timestamp = new Date().toISOString();
  const hasFailure = failed.length > 0;

  // 제목 결정
  const subject = hasFailure
    ? `[ddangit] ❌ Promo Failed - ${failed.map(r => r.platform).join(', ')}`
    : `[ddangit] ✅ Promo Success - ${success.map(r => r.platform).join(', ')}`;

  const html = `
    <h2>🔔 Promo Results - ${timestamp}</h2>
    <p><strong>Summary:</strong> ${success.length} succeeded, ${failed.length} failed, ${skipped.length} skipped</p>

    ${success.length > 0 ? `
      <h3>✅ Success (${success.length})</h3>
      <ul>
        ${success.map(r => `
          <li>
            <strong>${r.platform}</strong>
            ${r.postUrl ? `- <a href="${r.postUrl}">View Post</a>` : ''}
          </li>
        `).join('')}
      </ul>
    ` : ''}

    ${failed.length > 0 ? `
      <h3>❌ Failed (${failed.length})</h3>
      <ul>
        ${failed.map(r => `
          <li>
            <strong>${r.platform}</strong>: ${r.message}
            ${r.error ? `<br><code>${r.error}</code>` : ''}
          </li>
        `).join('')}
      </ul>
    ` : ''}

    ${skipped.length > 0 ? `
      <h3>⏭️ Skipped (${skipped.length})</h3>
      <ul>
        ${skipped.map(r => `<li><strong>${r.platform}</strong>: ${r.message}</li>`).join('')}
      </ul>
    ` : ''}
  `;

  await sendEmail({ subject, html });
}

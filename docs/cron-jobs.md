# Cron Jobs

## 현재 설정

| 항목 | 값 |
|------|-----|
| 경로 | `/api/promo/all` |
| 스케줄 | `0 9 * * *` (매일 09:00 UTC = KST 18:00) |
| 플랫폼 | Twitter (한/영 랜덤), Bluesky (영어) |
| 알림 | 이메일 (Resend) |

## 수동 실행

```bash
./scripts/promo.sh prod all       # 전체
./scripts/promo.sh prod twitter   # Twitter만
./scripts/promo.sh prod bluesky   # Bluesky만
```

## 환경변수 (Vercel)

| 변수 | 설명 |
|------|------|
| `TWITTER_API_KEY` | Twitter API Key |
| `TWITTER_API_SECRET` | Twitter API Secret |
| `TWITTER_ACCESS_TOKEN` | Twitter Access Token |
| `TWITTER_ACCESS_SECRET` | Twitter Access Secret |
| `BLUESKY_IDENTIFIER` | Bluesky 핸들 |
| `BLUESKY_PASSWORD` | Bluesky App Password |
| `RESEND_API_KEY` | Resend API Key |
| `NOTIFICATION_EMAIL` | 알림 이메일 |
| `PROMO_API_KEY` | 수동 발송용 API 키 |

## 모니터링

- Vercel Dashboard → Settings → Cron Jobs
- 로그: Vercel Logs → `[Promo]` 검색

## Cron 표현식

```
분 시 일 월 요일
0  9  *  *  *     → 매일 09:00 UTC
0  9  *  *  1,4   → 월,목 09:00 UTC
```

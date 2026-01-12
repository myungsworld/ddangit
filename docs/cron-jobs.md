# Cron Jobs (GitHub Actions)

## 현재 설정

| 항목 | 값 |
|------|-----|
| 경로 | `/api/promo/all` (POST) |
| 스케줄 | `0 9 * * *` (매일 09:00 UTC = KST 18:00) |
| 플랫폼 | 모든 configured 플랫폼 (동적) |
| 알림 | 이메일 (Resend) |
| 실행 | GitHub Actions |

## GitHub Actions Workflow

`.github/workflows/daily-promo.yml`에서 매일 자동 실행됩니다.

### 수동 실행
1. GitHub Repository → **Actions** 탭
2. **Daily Promo** workflow 선택
3. **Run workflow** 버튼 클릭

## 수동 실행 (CLI)

```bash
./scripts/promo.sh prod           # 전체 (모든 플랫폼)
./scripts/promo.sh prod twitter   # Twitter만
./scripts/promo.sh prod bluesky   # Bluesky만
```

## 환경변수

### Vercel (API 실행용)

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

### GitHub Actions (Workflow용)

Repository → Settings → Secrets → Actions에 추가:

| Secret | 설명 |
|--------|------|
| `PROMO_API_KEY` | API 인증 키 (.env.local 값) |

## 모니터링

- **GitHub Actions**: Repository → Actions → Daily Promo
- **Vercel Logs**: `[Promo]` 검색

## 새 플랫폼 추가 시

1. `src/infrastructure/social/adapters/`에 어댑터 추가
2. `src/infrastructure/social/index.ts`의 `adapters` 레지스트리에 등록
3. `src/infrastructure/social/types/index.ts`의 `Platform` 타입에 추가
4. 자동으로 cron에서 발송됨 (코드 변경 불필요)

## Cron 표현식

```
분 시 일 월 요일
0  9  *  *  *     → 매일 09:00 UTC
0  9  *  *  1,4   → 월,목 09:00 UTC
```

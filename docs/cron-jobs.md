# Cron Jobs

## 현재 설정

### 통합 홍보 (Twitter + Bluesky)

| 항목 | 값 |
|------|-----|
| **경로** | `/api/promo/all` |
| **스케줄** | `0 9 * * *` (매일 09:00 UTC) |
| **한국시간** | 매일 18:00 KST |
| **설정 파일** | `vercel.json` |
| **플랫폼** | Twitter (한국어/영어 랜덤), Bluesky (영어) |
| **알림** | 이메일 (성공/실패 모두) |

```json
{
  "crons": [
    {
      "path": "/api/promo/all",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## 작동 방식

1. Vercel이 스케줄에 따라 `/api/promo/all`에 GET 요청
2. 요청 헤더에 `x-vercel-cron: 1` 포함
3. 각 플랫폼 독립 실행 (하나가 실패해도 다른 플랫폼 계속 진행)
   - Twitter: 한국어/영어 랜덤 메시지 발송
   - Bluesky: 영어 메시지 발송
4. 결과 이메일 발송 (Resend)
5. 결과 로그 기록

---

## 모니터링

### Vercel Dashboard에서 확인

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택 → **Settings** → **Cron Jobs**
3. 실행 기록 및 상태 확인 가능

### CLI로 확인

```bash
# 상태 확인
curl https://ddangit.vercel.app/api/promo/all

# 응답 예시
{
  "status": "ok",
  "platforms": {
    "twitter": true,
    "bluesky": true
  },
  "schedule": "Daily at 09:00 UTC"
}
```

### 이메일 알림

Cron 실행 후 결과 이메일 발송:
- 성공: `[ddangit] ✅ Promo Success - twitter, bluesky`
- 실패: `[ddangit] ❌ Promo Failed - [실패한 플랫폼]`

### 로그 확인

Vercel Dashboard → **Logs** → `[Promo]` 검색

```
[Promo][All] Cron triggered at 2026-01-11T09:00:00.000Z
[Promo][Twitter] ✅ Tweet posted successfully
[Promo][Bluesky] ✅ Post created successfully
```

---

## 수동 실행

### 스크립트 사용

```bash
# 로컬 테스트
./scripts/promo.sh local

# 프로덕션 (모든 플랫폼)
./scripts/promo.sh prod
```

### curl 직접 호출

```bash
# 로컬 - 모든 플랫폼
curl -X POST http://localhost:3000/api/promo/all \
  -H "Content-Type: application/json" \
  -d '{}'

# Twitter만
curl -X POST http://localhost:3000/api/promo/twitter \
  -H "Content-Type: application/json" \
  -d '{"type": "general"}'
```

---

## 환경변수

### 필수 (Vercel에 설정)

| 변수 | 설명 |
|------|------|
| `TWITTER_API_KEY` | Twitter API Key |
| `TWITTER_API_SECRET` | Twitter API Secret |
| `TWITTER_ACCESS_TOKEN` | Twitter Access Token |
| `TWITTER_ACCESS_SECRET` | Twitter Access Secret |
| `BLUESKY_IDENTIFIER` | Bluesky 핸들 (예: ddangit.bsky.social) |
| `BLUESKY_PASSWORD` | Bluesky App Password |
| `RESEND_API_KEY` | Resend API Key |
| `NOTIFICATION_EMAIL` | 알림 받을 이메일 |

### 선택

| 변수 | 설명 |
|------|------|
| `PROMO_API_KEY` | 프로덕션 수동 발송용 API 키 |

---

## 홍보 플랫폼

### 활성화됨

| 플랫폼 | 상태 | 언어 | 비고 |
|--------|------|------|------|
| Twitter/X | ✅ 완료 | 한국어/영어 랜덤 | OAuth 1.0a |
| Bluesky | ✅ 완료 | 영어 | AT Protocol REST API |

### 미정

| 플랫폼 | 상태 | 비고 |
|--------|------|------|
| Discord | 🔲 미정 | Webhook 방식, 검색 유입 어려움 |
| Reddit | 🔲 미정 | 스팸 정책 주의, 수동 권장 |
| Product Hunt | 🔲 미정 | 런칭용 |

---

## Cron 표현식 참고

```
* * * * *
│ │ │ │ │
│ │ │ │ └── 요일 (0-7, 0과 7은 일요일)
│ │ │ └──── 월 (1-12)
│ │ └────── 일 (1-31)
│ └──────── 시 (0-23, UTC)
└────────── 분 (0-59)
```

**예시:**
- `0 9 * * *` - 매일 09:00 UTC (KST 18:00)
- `0 9 * * 1,4` - 월,목 09:00 UTC
- `0 9,21 * * *` - 매일 09:00, 21:00 UTC
